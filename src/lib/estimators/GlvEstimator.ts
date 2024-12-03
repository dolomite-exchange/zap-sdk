import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IERC20Abi from '../../abis/IERC20.json';
import IGlvReaderAbi from '../../abis/IGlvReader.json';
import IGlvRegistryAbi from '../../abis/IGlvRegistry.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import { IGlvReader } from '../../abis/types/IGlvReader';
import { IGlvRegistry } from '../../abis/types/IGlvRegistry';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxPrice, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  GLV_MARKETS_MAP,
  GLV_READER_MAP,
  GLV_REGISTRY_PROXY_MAP,
  GM_MARKETS_MAP,
  GMX_V2_DATA_STORE_MAP, GMX_V2_READER_MAP,
} from '../Constants';
import { LocalCache } from '../LocalCache';
import { GmxV2GmEstimator, SignedPriceData } from './GmxV2GmEstimator';
import PricePropsStruct = GmxPrice.PricePropsStruct;

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(4_000_000);

const GlvToGmMarketCacheKey = (glvToken: string): string => `GlvToGmMarket-${glvToken}`;

export class GlvEstimator {
  private readonly glvReader?: IGlvReader;
  private readonly glvRegistry?: IGlvRegistry;
  private readonly gmxV2Reader?: IGmxV2Reader;
  private readonly gmxV2DataStore?: IGmxV2DataStore;
  private readonly dataStoreCache: LocalCache<any>;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    private readonly gmxV2Estimator: GmxV2GmEstimator,
  ) {
    this.dataStoreCache = new LocalCache<any>(3600);
    if (network !== Network.ARBITRUM_ONE) {
      return;
    }

    this.glvReader = new ethers.Contract(
      GLV_READER_MAP[this.network]!,
      IGlvReaderAbi,
      this.web3Provider,
    ) as IGlvReader;

    this.glvRegistry = new ethers.Contract(
      GLV_REGISTRY_PROXY_MAP[this.network]!,
      IGlvRegistryAbi,
      this.web3Provider,
    ) as IGlvRegistry;

    this.gmxV2DataStore = new ethers.Contract(
      GMX_V2_DATA_STORE_MAP[this.network]!,
      IGmxV2DataStoreAbi,
      this.web3Provider,
    ) as IGmxV2DataStore;

    this.gmxV2Reader = new ethers.Contract(
      GMX_V2_READER_MAP[this.network]!,
      IGmxV2ReaderAbi,
      this.web3Provider,
    ) as IGmxV2Reader;
  }

  private static getPriceStruct(
    pricesMap: Record<Address, SignedPriceData>,
    token: Address,
  ): PricePropsStruct {
    return {
      min: pricesMap[token].minPrice,
      max: pricesMap[token].maxPrice,
    };
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    outputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const glvMarket = GLV_MARKETS_MAP[this.network]![isolationModeTokenAddress]!;
    const glvToken = glvMarket.glvTokenAddress;

    const [
      tokenToSignedPriceMap,
      gmMarketIsolationModeAddress,
      glvTokenSupply,
      glvPoolInfo,
    ] = await Promise.all([
      GmxV2GmEstimator.getTokenPrices(),
      this.getGmMarketByGlvToken(glvMarket.glvTokenAddress),
      (new ethers.Contract(glvToken, IERC20Abi, this.web3Provider)).totalSupply(),
      this.glvReader!.getGlvInfo(this.gmxV2DataStore!.address, glvToken),
    ]);

    const gmMarket = GM_MARKETS_MAP[this.network][gmMarketIsolationModeAddress]!;
    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = marketsMap[gmMarket.shortTokenId.toFixed()].tokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    /**
     * Steps to calculate the expected amount out:
     *  1. Get the GLV total supply and pool value
     *  2. Convert the amount of GLV tokens to USD using the pool value and total supply
     *  3. Get the GM market pool value and total supply
     *  4. Use the GLV USD value, GM market pool value, and GM total supply to calculate the amount of GM tokens
     *  5. Get the expected amount of output tokens using the GM amount the same as GmxV2Estimator
     */

    const glvPoolValue = await this.glvReader!.getGlvValue(
      this.gmxV2DataStore!.address,
      glvPoolInfo.markets,
      await this.getIndexPricesStruct(tokenToSignedPriceMap, glvPoolInfo.markets),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.longToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.shortToken),
      glvPoolInfo.glv.glvToken,
      false,
    );
    const glvTokenUsd = glvPoolValue.mul(amountIn.toFixed()).div(glvTokenSupply);

    const marketPoolValue = await this.gmxV2Reader!.getMarketTokenPrice(
      this.gmxV2DataStore!.address,
      {
        marketToken,
        indexToken,
        longToken,
        shortToken,
      },
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, indexToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, longToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, shortToken),
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string'], ['MAX_PNL_FACTOR_FOR_WITHDRAWALS'])),
      true,
    );
    const marketTokenSupply = await (new ethers.Contract(marketToken, IERC20Abi, this.web3Provider)).totalSupply();
    const gmAmountOut = marketTokenSupply.mul(glvTokenUsd).div(marketPoolValue[1].poolValue);

    return this.gmxV2Estimator.getUnwrappedAmount(
      gmMarketIsolationModeAddress,
      new BigNumber(gmAmountOut.toString()),
      outputMarketId,
      marketsMap,
      config,
      tokenToSignedPriceMap,
      CALLBACK_GAS_LIMIT,
    );
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    inputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const glvMarket = GLV_MARKETS_MAP[this.network]![isolationModeTokenAddress]!;
    const glvToken = glvMarket.glvTokenAddress;

    const [
      tokenToSignedPriceMap,
      gmMarketIsolationModeAddress,
      glvTokenSupply,
      glvPoolInfo,
    ] = await Promise.all([
      GmxV2GmEstimator.getTokenPrices(),
      this.getGmMarketByGlvToken(glvMarket.glvTokenAddress),
      (new ethers.Contract(glvToken, IERC20Abi, this.web3Provider)).totalSupply(),
      this.glvReader!.getGlvInfo(this.gmxV2DataStore!.address, glvToken),
    ]);
    const inputToken = marketsMap[inputMarketId.toFixed()];

    const gmMarket = GM_MARKETS_MAP[this.network][gmMarketIsolationModeAddress]!;
    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = marketsMap[gmMarket.shortTokenId.toFixed()].tokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    if (inputToken.tokenAddress !== longToken && inputToken.tokenAddress !== shortToken) {
      return Promise.reject(new Error(`Invalid inputToken, found: ${inputToken.symbol} / ${inputToken.tokenAddress}`));
    }

    const gmAmountOutResult = await this.gmxV2Estimator.getWrappedAmount(
      gmMarketIsolationModeAddress,
      amountIn,
      inputMarketId,
      marketsMap,
      config,
      tokenToSignedPriceMap,
      CALLBACK_GAS_LIMIT,
    );

    /**
     * Steps to calculate the expected GLV amount:
     *  1. Get the expected amount of GM tokens same as GmxV2Estimator
     *  2. Get the GmMarketPool value
     *  3. Use the market pool value, gm token amount, and total supply to calculate USD value of gm tokens
     *  4. Get the GLV pool value
     *  5. Use the glv supply, usd value of the gm tokens, and glv value to estimate the amount of GLV tokens
     */

    const poolValue = await this.gmxV2Reader!.getMarketTokenPrice(
      this.gmxV2DataStore!.address,
      {
        marketToken,
        indexToken,
        longToken,
        shortToken,
      },
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, indexToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, longToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, shortToken),
      ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['string'], ['MAX_PNL_FACTOR_FOR_DEPOSITS'])),
      false,
    );
    if (poolValue[1].poolValue.isNegative()) {
      throw new Error('Panic: Pool value is negative');
    }
    const marketTokenSupply = await (new ethers.Contract(marketToken, IERC20Abi, this.web3Provider)).totalSupply();
    const receivedMarketTokensUsd = poolValue[1].poolValue
      .mul(gmAmountOutResult.amountOut.toFixed())
      .div(marketTokenSupply);

    const glvPoolValue = await this.glvReader!.getGlvValue(
      this.gmxV2DataStore!.address,
      glvPoolInfo.markets,
      await this.getIndexPricesStruct(tokenToSignedPriceMap, glvPoolInfo.markets),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.longToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.shortToken),
      glvPoolInfo.glv.glvToken,
      true,
    );
    const amountOut = glvTokenSupply.mul(receivedMarketTokensUsd).div(glvPoolValue);

    return {
      ...gmAmountOutResult,
      amountOut: new BigNumber(amountOut.toString()),
    };
  }

  private async getGmMarketByGlvToken(glvToken: string): Promise<string> {
    let gmMarketIsolationModeAddress = this.dataStoreCache.get(GlvToGmMarketCacheKey(glvToken));
    if (gmMarketIsolationModeAddress) {
      return gmMarketIsolationModeAddress;
    }

    const gmMarketAddress = await this.glvRegistry!.glvTokenToGmMarket(glvToken);
    const gmMarketsMap = GM_MARKETS_MAP[this.network];
    [gmMarketIsolationModeAddress] = Object.keys(gmMarketsMap).filter(isolationModeAddress => {
      return gmMarketsMap[isolationModeAddress]!.marketTokenAddress.toLowerCase() === gmMarketAddress.toLowerCase();
    });

    this.dataStoreCache.set(GlvToGmMarketCacheKey(glvToken), gmMarketIsolationModeAddress);
    return gmMarketIsolationModeAddress;
  }

  private async getIndexPricesStruct(
    pricesMap: Record<Address, SignedPriceData>,
    markets: Address[],
  ): Promise<PricePropsStruct[]> {
    const pricesStruct: PricePropsStruct[] = [];
    for (let i = 0; i < markets.length; i += 1) {
      const { indexToken } = await this.gmxV2Reader!.getMarket(this.gmxV2DataStore!.address, markets[i]);
      pricesStruct.push(GlvEstimator.getPriceStruct(pricesMap, indexToken));
    }
    return pricesStruct;
  }
}
