import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils';
import IArbitrumGasInfoAbi from '../../abis/IArbitrumGasInfo.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import { IArbitrumGasInfo } from '../../abis/types/IArbitrumGasInfo';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxMarket, GmxPrice, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  ADDRESS_ZERO,
  ARBITRUM_GAS_INFO_MAP,
  BYTES_EMPTY,
  GM_MARKETS_MAP,
  GMX_V2_DATA_STORE_MAP,
  GMX_V2_READER_MAP,
} from '../Constants';
import { LocalCache } from '../LocalCache';
import MarketPricesStruct = GmxMarket.MarketPricesStruct;

interface SignedPriceData {
  tokenAddress: string;
  minPrice: string;
  maxPrice: string;
}

const abiCoder = ethers.utils.defaultAbiCoder;

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(2_500_000);

const DEPOSIT_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32', 'bool'],
    [keccak256(abiCoder.encode(['string'], ['DEPOSIT_GAS_LIMIT'])), /* _singleToken = */ true],
  ),
);

const SINGLE_SWAP_GAS_LIMIT_KEY = keccak256(abiCoder.encode(['string'], ['SINGLE_SWAP_GAS_LIMIT']));

const WITHDRAWAL_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32'],
    [keccak256(abiCoder.encode(['string'], ['WITHDRAWAL_GAS_LIMIT']))],
  ),
);

const POOL_AMOUNT_KEY = keccak256(abiCoder.encode(['string'], ['POOL_AMOUNT']));

const ONE_ETH = ethers.utils.parseEther('1');

const WithdrawalGasLimitsCacheKey = 'WithdrawalGasLimits';
const DepositGasLimitsCacheKey = 'DepositGasLimits';

interface WithdrawalGasLimits {
  withdrawalGasLimit: ethers.BigNumber;
  swapGasLimit: ethers.BigNumber;
}

interface DepositGasLimits {
  depositGasLimit: ethers.BigNumber;
}

export class GmxV2GmEstimator {
  private readonly gmxV2Reader?: IGmxV2Reader;
  private readonly gmxV2DataStore?: IGmxV2DataStore;
  private readonly arbitrumGasInfo?: IArbitrumGasInfo;
  private readonly dataStoreCache: LocalCache<any>;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    private readonly gasMultiplier: BigNumber,
  ) {
    this.dataStoreCache = new LocalCache<WithdrawalGasLimits>(3600);
    if (network !== Network.ARBITRUM_ONE) {
      return
    }

    this.gmxV2Reader = new ethers.Contract(
      GMX_V2_READER_MAP[this.network]!,
      IGmxV2ReaderAbi,
      this.web3Provider,
    ) as IGmxV2Reader;

    this.gmxV2DataStore = new ethers.Contract(
      GMX_V2_DATA_STORE_MAP[this.network]!,
      IGmxV2DataStoreAbi,
      this.web3Provider,
    ) as IGmxV2DataStore;

    this.arbitrumGasInfo = new ethers.Contract(
      ARBITRUM_GAS_INFO_MAP[this.network]!,
      IArbitrumGasInfoAbi,
      this.web3Provider,
    ) as IArbitrumGasInfo;

    if (gasMultiplier.lt(1)) {
      throw new Error(`Invalid gasMultiplier, expected at least 1.0, but found ${gasMultiplier.toFixed()}`);
    }
  }

  private static getPricesStruct(
    pricesMap: Record<Address, SignedPriceData>,
    indexToken: Address,
    longToken: Address,
    shortToken: Address,
  ): MarketPricesStruct {
    return {
      indexTokenPrice: {
        min: pricesMap[indexToken].minPrice,
        max: pricesMap[indexToken].maxPrice,
      },
      longTokenPrice: {
        min: pricesMap[longToken].minPrice,
        max: pricesMap[longToken].maxPrice,
      },
      shortTokenPrice: {
        min: pricesMap[shortToken].minPrice,
        max: pricesMap[shortToken].maxPrice,
      },
    };
  }

  private static async getTokenPrices(): Promise<Record<Address, SignedPriceData>> {
    return axios.get('https://arbitrum-api.gmxinfra.io/prices/tickers')
      .then(res => res.data)
      .then(data => (data as any[]).reduce((memo, priceData) => {
        const tokenAddress = ethers.utils.getAddress(priceData.tokenAddress);
        memo[tokenAddress] = {
          ...priceData,
          tokenAddress,
        };
        return memo;
      }, {}));
  }

  private static averagePrices(prices: GmxPrice.PricePropsStruct): ethers.BigNumber {
    return ethers.BigNumber.from(prices.min.toString()).add(prices.max.toString()).div(2);
  }

  private static getPoolAmountKey(market: string, token: string): string {
    return keccak256(
      defaultAbiCoder.encode(
        ['bytes32', 'address', 'address'],
        [POOL_AMOUNT_KEY, market, token],
      ),
    )
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    outputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const tokenToSignedPriceMap = await GmxV2GmEstimator.getTokenPrices();
    const outputToken = marketsMap[outputMarketId.toFixed()];

    const gmMarket = GM_MARKETS_MAP[this.network]![isolationModeTokenAddress]!;
    const indexToken = gmMarket.indexTokenAddress;
    const longToken = marketsMap[gmMarket.longTokenId.toFixed()].tokenAddress;
    const shortToken = marketsMap[gmMarket.shortTokenId.toFixed()].tokenAddress;
    const marketToken = gmMarket.marketTokenAddress;
    const gmMarketProps = {
      indexToken,
      longToken,
      shortToken,
      marketToken,
    };
    const pricesStruct = GmxV2GmEstimator.getPricesStruct(tokenToSignedPriceMap, indexToken, longToken, shortToken);

    const [longAmountOut, shortAmountOut] = await this.gmxV2Reader!.getWithdrawalAmountOut(
      this.gmxV2DataStore!.address,
      gmMarketProps,
      pricesStruct,
      amountIn.toFixed(),
      ADDRESS_ZERO,
    );

    const weight = await this.getWeightForOtherAmount(
      outputToken,
      longToken,
      shortToken,
      marketToken,
      pricesStruct,
    );

    const amountOut = outputToken.tokenAddress === longToken ? longAmountOut : shortAmountOut;

    const [otherAmountOut] = longToken === shortToken
      ? [shortAmountOut]
      : await this.gmxV2Reader!.getSwapAmountOut(
        this.gmxV2DataStore!.address,
        gmMarketProps,
        pricesStruct,
        outputToken.tokenAddress === longToken ? shortToken : longToken,
        outputToken.tokenAddress === longToken ? shortAmountOut : longAmountOut,
        ADDRESS_ZERO,
      );

    const [limits, gasPriceWei] = await Promise.all([
      this.getWithdrawalGasLimits(),
      this.getGasPrice(config),
    ]);
    const totalWithdrawalGasLimit = limits.withdrawalGasLimit.add(limits.swapGasLimit).add(CALLBACK_GAS_LIMIT);
    const executionFee = new BigNumber(
      totalWithdrawalGasLimit.mul(gasPriceWei).mul(this.gasMultiplier.toString()).toString(),
    );

    const otherAmountOutWithSlippage = config.isLiquidation
      ? new BigNumber(1)
      : new BigNumber(otherAmountOut.toString())
        .multipliedBy(1 - config.slippageTolerance)
        .integerValue(BigNumber.ROUND_DOWN);
    return {
      amountOut: new BigNumber(amountOut.add(otherAmountOut).toString()),
      tradeData: abiCoder.encode(
        ['tuple(uint256 value)', 'uint256'],
        [{ value: weight }, otherAmountOutWithSlippage.toFixed()],
      ),
      extraData: {
        executionFee,
      },
    };
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    inputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const tokenToSignedPriceMap = await GmxV2GmEstimator.getTokenPrices();
    const inputToken = marketsMap[inputMarketId.toFixed()];

    const gmMarket = GM_MARKETS_MAP[this.network]![isolationModeTokenAddress]!;
    const indexToken = gmMarket.indexTokenAddress;
    const longToken = marketsMap[gmMarket.longTokenId.toFixed()].tokenAddress;
    const shortToken = marketsMap[gmMarket.shortTokenId.toFixed()].tokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    if (inputToken.tokenAddress !== longToken && inputToken.tokenAddress !== shortToken) {
      return Promise.reject(new Error(`Invalid inputToken, found: ${inputToken.symbol} / ${inputToken.tokenAddress}`));
    }

    const amountOut = await this.gmxV2Reader!.getDepositAmountOut(
      this.gmxV2DataStore!.address,
      {
        marketToken,
        indexToken,
        longToken,
        shortToken,
      },
      GmxV2GmEstimator.getPricesStruct(tokenToSignedPriceMap, indexToken, longToken, shortToken),
      inputToken.tokenAddress === longToken ? amountIn.toFixed() : '0',
      inputToken.tokenAddress === shortToken && longToken !== shortToken ? amountIn.toFixed() : '0',
      ADDRESS_ZERO,
    );

    const [limits, gasPriceWei] = await Promise.all([
      this.getDepositGasLimits(),
      this.getGasPrice(config),
    ]);
    const totalDepositGasLimit = limits.depositGasLimit.add(CALLBACK_GAS_LIMIT);
    const executionFee = new BigNumber(
      totalDepositGasLimit.mul(gasPriceWei).mul(this.gasMultiplier.toString()).toString(),
    );

    return {
      amountOut: new BigNumber(amountOut.toString()),
      tradeData: BYTES_EMPTY,
      extraData: {
        executionFee,
      },
    };
  }

  private async getWeightForOtherAmount(
    outputToken: ApiMarket,
    longToken: string,
    shortToken: string,
    marketToken: string,
    pricesStruct: GmxMarket.MarketPricesStruct,
  ): Promise<ethers.BigNumber> {
    const divisor = ethers.BigNumber.from(longToken === shortToken ? 2 : 1);
    const [longBalance, shortBalance] = await Promise.all([
      this.gmxV2DataStore!.getUint(GmxV2GmEstimator.getPoolAmountKey(marketToken, longToken)),
      this.gmxV2DataStore!.getUint(GmxV2GmEstimator.getPoolAmountKey(marketToken, shortToken)),
    ]);

    const longBalanceUsd = longBalance.mul(GmxV2GmEstimator.averagePrices(pricesStruct.longTokenPrice)).div(divisor);
    const shortBalanceUsd = shortBalance.mul(GmxV2GmEstimator.averagePrices(pricesStruct.shortTokenPrice)).div(divisor);
    const totalBalanceUsd = longBalanceUsd.add(shortBalanceUsd);
    return outputToken.tokenAddress === longToken
      ? ONE_ETH.mul(shortBalanceUsd).div(totalBalanceUsd)
      : ONE_ETH.mul(longBalanceUsd).div(totalBalanceUsd);
  }

  private async getWithdrawalGasLimits(): Promise<WithdrawalGasLimits> {
    const cachedValue = this.dataStoreCache.get(WithdrawalGasLimitsCacheKey)
    if (cachedValue) {
      return cachedValue;
    }

    const withdrawalGasLimit = await this.gmxV2DataStore!.getUint(WITHDRAWAL_GAS_LIMIT_KEY);
    const swapGasLimit = await this.gmxV2DataStore!.getUint(SINGLE_SWAP_GAS_LIMIT_KEY);
    const value = {
      withdrawalGasLimit,
      swapGasLimit,
    };
    this.dataStoreCache.set(WithdrawalGasLimitsCacheKey, value);

    return value;
  }

  private async getDepositGasLimits(): Promise<DepositGasLimits> {
    const cachedValue = this.dataStoreCache.get(DepositGasLimitsCacheKey)
    if (cachedValue) {
      return cachedValue;
    }

    const depositGasLimit = await this.gmxV2DataStore!.getUint(DEPOSIT_GAS_LIMIT_KEY);
    const value: DepositGasLimits = {
      depositGasLimit,
    };
    this.dataStoreCache.set(DepositGasLimitsCacheKey, value);

    return value;
  }

  private async getGasPrice(config: ZapConfig): Promise<BigNumberish> {
    return config.gasPriceInWei
      ? config.gasPriceInWei.toFixed()
      : (await this.arbitrumGasInfo!.getPricesInWei())[5];
  }
}
