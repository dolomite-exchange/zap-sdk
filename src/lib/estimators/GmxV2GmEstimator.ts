import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import IArbitrumGasInfoAbi from '../../abis/IArbitrumGasInfo.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import { IArbitrumGasInfo } from '../../abis/types/IArbitrumGasInfo';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxMarket, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  ADDRESS_ZERO,
  ARBITRUM_GAS_INFO_MAP,
  GM_MARKETS_MAP,
  GMX_V2_DATA_STORE_MAP,
  GMX_V2_READER_MAP,
} from '../Constants';
import MarketPricesStruct = GmxMarket.MarketPricesStruct;

interface SignedPriceData {
  tokenAddress: string;
  minPriceFull: string;
  maxPriceFull: string;
}

const abiCoder = ethers.utils.defaultAbiCoder;

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(2_000_000);

const GAS_MULTIPLIER = ethers.BigNumber.from(5);

const DEPOSIT_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32', 'bool'],
    [keccak256(abiCoder.encode(['string'], ['DEPOSIT_GAS_LIMIT'])), /* _singleToken = */ true],
  ),
);

const SINGLE_SWAP_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32'],
    [keccak256(abiCoder.encode(['string'], ['SINGLE_SWAP_GAS_LIMIT']))],
  ),
);

const WITHDRAWAL_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32'],
    [keccak256(abiCoder.encode(['string'], ['WITHDRAWAL_GAS_LIMIT']))],
  ),
);

export class GmxV2GmEstimator {
  private readonly gmxV2Reader: IGmxV2Reader;
  private readonly gmxV2DataStore: IGmxV2DataStore;
  private readonly arbitrumGasInfo: IArbitrumGasInfo;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
  ) {
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
  }

  private static getPricesStruct(
    pricesMap: Record<Address, SignedPriceData>,
    indexToken: Address,
    longToken: Address,
    shortToken: Address,
  ): MarketPricesStruct {
    return {
      indexTokenPrice: {
        min: pricesMap[indexToken].minPriceFull,
        max: pricesMap[indexToken].maxPriceFull,
      },
      longTokenPrice: {
        min: pricesMap[longToken].minPriceFull,
        max: pricesMap[longToken].maxPriceFull,
      },
      shortTokenPrice: {
        min: pricesMap[shortToken].minPriceFull,
        max: pricesMap[shortToken].maxPriceFull,
      },
    };
  }

  private static async getTokenPrices(): Promise<Record<Address, SignedPriceData>> {
    return axios.get('https://arbitrum-api.gmxinfra.io/signed_prices/latest')
      .then(res => res.data)
      .then(data => (data.signedPrices as SignedPriceData[]).reduce((memo, priceData) => {
        memo[ethers.utils.getAddress(priceData.tokenAddress)] = priceData;
        return memo;
      }, {}));
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
    const indexToken = marketsMap[gmMarket.indexTokenId.toFixed()].tokenAddress;
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

    const [longAmountOut, shortAmountOut] = await this.gmxV2Reader.getWithdrawalAmountOut(
      this.gmxV2DataStore.address,
      gmMarketProps,
      pricesStruct,
      amountIn.toFixed(),
      ADDRESS_ZERO,
    );

    const amountOut = outputToken.tokenAddress === longToken ? longAmountOut : shortAmountOut;
    const extraSwapAmountOut = await this.gmxV2Reader.getSwapAmountOut(
      this.gmxV2DataStore.address,
      gmMarketProps,
      pricesStruct,
      outputToken.tokenAddress === longToken ? shortToken : longToken,
      outputToken.tokenAddress === longToken ? shortAmountOut : longAmountOut,
      ADDRESS_ZERO,
    );

    const [withdrawalGasLimit, swapGasLimit, gasPriceWei] = await Promise.all([
      this.gmxV2DataStore.getUint(WITHDRAWAL_GAS_LIMIT_KEY),
      this.gmxV2DataStore.getUint(SINGLE_SWAP_GAS_LIMIT_KEY),
      this.getGasPrice(config),
    ]);
    const totalWithdrawalGasLimit = withdrawalGasLimit.add(swapGasLimit).add(CALLBACK_GAS_LIMIT);

    return {
      amountOut: new BigNumber(amountOut.add(extraSwapAmountOut[0]).toString()),
      tradeData: abiCoder.encode(['uint256'], [totalWithdrawalGasLimit.mul(gasPriceWei).mul(GAS_MULTIPLIER)]),
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
    const indexToken = marketsMap[gmMarket.indexTokenId.toFixed()].tokenAddress;
    const longToken = marketsMap[gmMarket.longTokenId.toFixed()].tokenAddress;
    const shortToken = marketsMap[gmMarket.shortTokenId.toFixed()].tokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    const amountOut = await this.gmxV2Reader.getDepositAmountOut(
      this.gmxV2DataStore.address,
      {
        indexToken,
        longToken,
        shortToken,
        marketToken,
      },
      GmxV2GmEstimator.getPricesStruct(tokenToSignedPriceMap, indexToken, longToken, shortToken),
      inputToken.tokenAddress === longToken ? amountIn.toFixed() : '0',
      inputToken.tokenAddress === shortToken ? amountIn.toFixed() : '0',
      ADDRESS_ZERO,
    );

    const [depositGasLimit, gasPriceWei] = await Promise.all([
      this.gmxV2DataStore.getUint(DEPOSIT_GAS_LIMIT_KEY),
      this.getGasPrice(config),
    ]);
    const totalDepositGasLimit = depositGasLimit.add(CALLBACK_GAS_LIMIT);

    return {
      amountOut: new BigNumber(amountOut.toString()),
      tradeData: abiCoder.encode(['uint256'], [totalDepositGasLimit.mul(gasPriceWei).mul(GAS_MULTIPLIER)]),
    };
  }

  private async getGasPrice(config: ZapConfig): Promise<BigNumberish> {
    return config.gasPriceInWei
      ? config.gasPriceInWei.toFixed()
      : (await this.arbitrumGasInfo.getPricesInWei())[5];
  }
}
