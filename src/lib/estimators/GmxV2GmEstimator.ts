import BigNumber from 'bignumber.js';
import { BigNumberish, ethers } from 'ethers';
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils';
import IArbitrumGasInfoAbi from '../../abis/IArbitrumGasInfo.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import MulticallAbi from '../../abis/Multicall.json';
import { IArbitrumGasInfo } from '../../abis/types/IArbitrumGasInfo';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxMarket, GmxPrice, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Multicall, Multicall__CallStruct } from '../../abis/types/Multicall';
import { AxiosClient } from '../../clients/AxiosClient';
import { Address, ApiMarket, EstimateOutputResult, GmMarket, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  ADDRESS_ZERO,
  ARBITRUM_GAS_INFO_MAP,
  BYTES_EMPTY,
  GMX_V2_DATA_STORE_MAP,
  GMX_V2_READER_MAP,
  MULTICALL_MAP,
} from '../Constants';
import { LocalCache } from '../LocalCache';
import MarketPricesStruct = GmxMarket.MarketPricesStruct;

enum SwapPricingType {
  TwoStep,
  Shift,
  Atomic
}

export interface SignedPriceData {
  tokenAddress: string;
  minPrice: string;
  maxPrice: string;
}

const abiCoder = ethers.utils.defaultAbiCoder;

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(3_000_000);

export const DEPOSIT_GAS_LIMIT_KEY = keccak256(abiCoder.encode(['string'], ['DEPOSIT_GAS_LIMIT']));

export const SINGLE_SWAP_GAS_LIMIT_KEY = keccak256(abiCoder.encode(['string'], ['SINGLE_SWAP_GAS_LIMIT']));

export const WITHDRAWAL_GAS_LIMIT_KEY = keccak256(abiCoder.encode(['string'], ['WITHDRAWAL_GAS_LIMIT']));

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
  private readonly multicall?: Multicall;
  private readonly dataStoreCache: LocalCache<any>;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    private readonly gasMultiplier: BigNumber,
  ) {
    this.dataStoreCache = new LocalCache<WithdrawalGasLimits>(3600);
    if (network !== Network.ARBITRUM_ONE) {
      return;
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

    this.multicall = new ethers.Contract(
      MULTICALL_MAP[this.network]!,
      MulticallAbi,
      this.web3Provider,
    ) as Multicall;

    if (gasMultiplier.lt(1)) {
      throw new Error(`Invalid gasMultiplier, expected at least 1.0, but found ${gasMultiplier.toFixed()}`);
    }
  }

  static async getTokenPrices(): Promise<Record<Address, SignedPriceData>> {
    return AxiosClient.get('https://arbitrum-api.gmxinfra.io/prices/tickers')
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

  private static averagePrices(prices: GmxPrice.PricePropsStruct): ethers.BigNumber {
    return ethers.BigNumber.from(prices.min.toString()).add(prices.max.toString()).div(2);
  }

  private static getPoolAmountKey(market: string, token: string): string {
    return keccak256(
      defaultAbiCoder.encode(
        ['bytes32', 'address', 'address'],
        [POOL_AMOUNT_KEY, market, token],
      ),
    );
  }

  public async getUnwrappedAmount(
    gmMarket: GmMarket,
    amountIn: Integer,
    outputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
    tokenPrices?: Record<string, SignedPriceData>,
    gasLimitOverride?: ethers.BigNumber,
    callbackGasLimit: ethers.BigNumber = CALLBACK_GAS_LIMIT,
  ): Promise<EstimateOutputResult> {
    const tokenToSignedPriceMap = tokenPrices ?? await GmxV2GmEstimator.getTokenPrices();
    const outputToken = marketsMap[outputMarketId.toFixed()];

    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = gmMarket.shortTokenAddress;
    const marketToken = gmMarket.marketTokenAddress;
    const gmMarketProps = {
      indexToken,
      longToken,
      shortToken,
      marketToken,
    };
    const pricesStruct = GmxV2GmEstimator.getPricesStruct(tokenToSignedPriceMap, indexToken, longToken, shortToken);

    const longAmountKey = GmxV2GmEstimator.getPoolAmountKey(marketToken, longToken);
    const shortAmountKey = GmxV2GmEstimator.getPoolAmountKey(marketToken, shortToken);
    const calls: Multicall__CallStruct[] = [
      {
        target: this.gmxV2DataStore!.address,
        callData: (await this.gmxV2DataStore!.populateTransaction.getUint(longAmountKey)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await this.gmxV2DataStore!.populateTransaction.getUint(shortAmountKey)).data!,
      },
      {
        target: this.gmxV2Reader!.address,
        callData: (await this.gmxV2Reader!.populateTransaction.getWithdrawalAmountOut(
          this.gmxV2DataStore!.address,
          gmMarketProps,
          pricesStruct,
          amountIn.toFixed(),
          ADDRESS_ZERO,
          SwapPricingType.TwoStep,
        )).data!,
      },
    ];

    const [
      { returnData },
      limits,
      gasPriceWei,
    ] = await Promise.all([
      this.multicall!.callStatic.aggregate(calls),
      this.getWithdrawalGasLimits(gasLimitOverride),
      this.getGasPrice(config),
    ]);

    const weight = this.getWeightForOtherAmount(
      outputToken,
      longToken,
      shortToken,
      pricesStruct,
      this.gmxV2DataStore!.interface.decodeFunctionResult('getUint', returnData[0])[0],
      this.gmxV2DataStore!.interface.decodeFunctionResult('getUint', returnData[1])[0],
    );

    const [longAmountOut, shortAmountOut] = this.gmxV2Reader!.interface.decodeFunctionResult(
      'getWithdrawalAmountOut',
      returnData[2],
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

    const totalWithdrawalGasLimit = limits.withdrawalGasLimit.add(limits.swapGasLimit).add(callbackGasLimit);
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
    gmMarket: GmMarket,
    amountIn: Integer,
    inputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
    config: ZapConfig,
    tokenPrices?: Record<string, SignedPriceData>,
    gasLimitOverride?: ethers.BigNumber,
    callbackGasLimit: ethers.BigNumber = CALLBACK_GAS_LIMIT,
  ): Promise<EstimateOutputResult> {
    const tokenToSignedPriceMap = tokenPrices ?? await GmxV2GmEstimator.getTokenPrices();
    const inputToken = marketsMap[inputMarketId.toFixed()];

    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = gmMarket.shortTokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    if (inputToken.tokenAddress !== longToken && inputToken.tokenAddress !== shortToken) {
      return Promise.reject(new Error(`Invalid inputToken, found: ${inputToken.symbol} / ${inputToken.tokenAddress}`));
    }

    const [amountOut, limits, gasPriceWei] = await Promise.all([
      this.gmxV2Reader!.getDepositAmountOut(
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
        SwapPricingType.TwoStep,
        true,
      ),
      this.getDepositGasLimits(gasLimitOverride),
      this.getGasPrice(config),
    ]);

    const totalDepositGasLimit = limits.depositGasLimit.add(callbackGasLimit);
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

  private getWeightForOtherAmount(
    outputToken: ApiMarket,
    longToken: string,
    shortToken: string,
    pricesStruct: GmxMarket.MarketPricesStruct,
    longBalance: ethers.BigNumber,
    shortBalance: ethers.BigNumber,
  ): ethers.BigNumber {
    const divisor = ethers.BigNumber.from(longToken === shortToken ? 2 : 1);
    const longBalanceUsd = longBalance.mul(GmxV2GmEstimator.averagePrices(pricesStruct.longTokenPrice)).div(divisor);
    const shortBalanceUsd = shortBalance.mul(GmxV2GmEstimator.averagePrices(pricesStruct.shortTokenPrice)).div(divisor);
    const totalBalanceUsd = longBalanceUsd.add(shortBalanceUsd);

    return outputToken.tokenAddress === longToken
      ? ONE_ETH.mul(shortBalanceUsd).div(totalBalanceUsd)
      : ONE_ETH.mul(longBalanceUsd).div(totalBalanceUsd);
  }

  private async getWithdrawalGasLimits(gasLimitOverride?: ethers.BigNumber): Promise<WithdrawalGasLimits> {
    if (gasLimitOverride) {
      return {
        withdrawalGasLimit: gasLimitOverride,
        swapGasLimit: ethers.BigNumber.from('0'),
      };
    }

    const cachedValue = this.dataStoreCache.get(WithdrawalGasLimitsCacheKey);
    if (cachedValue) {
      return cachedValue;
    }

    const calls: Multicall__CallStruct[] = [
      {
        target: this.gmxV2DataStore!.address,
        callData: (await this.gmxV2DataStore!.populateTransaction.getUint(WITHDRAWAL_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await this.gmxV2DataStore!.populateTransaction.getUint(SINGLE_SWAP_GAS_LIMIT_KEY)).data!,
      },
    ];

    const { returnData } = await this.multicall!.callStatic.aggregate(calls);
    const withdrawalGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[0],
    )[0] as ethers.BigNumber;
    const swapGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[1],
    )[0] as ethers.BigNumber;

    const value = {
      withdrawalGasLimit,
      swapGasLimit,
    };
    this.dataStoreCache.set(WithdrawalGasLimitsCacheKey, value);

    return value;
  }

  private async getDepositGasLimits(gasLimitOverride?: ethers.BigNumber): Promise<DepositGasLimits> {
    if (gasLimitOverride) {
      return {
        depositGasLimit: gasLimitOverride,
      };
    }

    const cachedValue = this.dataStoreCache.get(DepositGasLimitsCacheKey);
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
