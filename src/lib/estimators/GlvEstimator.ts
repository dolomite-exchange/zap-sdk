import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import IERC20Abi from '../../abis/IERC20.json';
import IGlvReaderAbi from '../../abis/IGlvReader.json';
import IGlvRegistryAbi from '../../abis/IGlvRegistry.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import MulticallAbi from '../../abis/Multicall.json';
import { IERC20 } from '../../abis/types/IERC20';
import { IGlvReader } from '../../abis/types/IGlvReader';
import { IGlvRegistry } from '../../abis/types/IGlvRegistry';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxMarketPoolValueInfo, GmxPrice, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Multicall, Multicall__CallStruct } from '../../abis/types/Multicall';
import { Address, ApiMarket, EstimateOutputResult, GmMarket, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  GLV_READER_MAP,
  GLV_REGISTRY_PROXY_MAP,
  GMX_V2_DATA_STORE_MAP,
  GMX_V2_READER_MAP,
  MULTICALL_MAP,
} from '../Constants';
import { GLV_MARKETS_MAP } from '../GlvMarkets';
import { GM_MARKETS_MAP } from '../GmMarkets';
import { LocalCache } from '../LocalCache';
import { GmxV2GmEstimator, SignedPriceData, SINGLE_SWAP_GAS_LIMIT_KEY } from './GmxV2GmEstimator';
import PricePropsStruct = GmxPrice.PricePropsStruct;

const abiCoder = ethers.utils.defaultAbiCoder;

const hashString = (value: string) => keccak256(abiCoder.encode(['string'], [value]));

const ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1_KEY = hashString('ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1');

const ESTIMATED_GAS_FEE_PER_ORACLE_PRICE_KEY = hashString('ESTIMATED_GAS_FEE_PER_ORACLE_PRICE');

const ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR_KEY = hashString('ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR');

const GLV_DEPOSIT_GAS_LIMIT_KEY = hashString('GLV_DEPOSIT_GAS_LIMIT');

const GLV_WITHDRAWAL_GAS_LIMIT_KEY = hashString('GLV_WITHDRAWAL_GAS_LIMIT');

const GLV_PER_MARKET_GAS_LIMIT_KEY = hashString('GLV_PER_MARKET_GAS_LIMIT');

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(4_000_000);

const FLOAT_PRECISION = ethers.BigNumber.from(10).pow(30);

const GlvToGmMarketCacheKey = (glvToken: string, isDeposit: boolean): string => `GlvToGmMarket-${isDeposit
  ? 'Deposit'
  : 'Withdrawal'}-${glvToken}`;
const DepositGasLimitCacheKey = 'DepositGasLimit';
const WithdrawalGasLimitCacheKey = 'WithdrawalGasLimit';

export class GlvEstimator {
  private readonly glvReader?: IGlvReader;
  private readonly glvRegistry?: IGlvRegistry;
  private readonly gmxV2Reader?: IGmxV2Reader;
  private readonly gmxV2DataStore?: IGmxV2DataStore;
  private readonly multicall?: Multicall;
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

    this.multicall = new ethers.Contract(
      MULTICALL_MAP[this.network]!,
      MulticallAbi,
      this.web3Provider,
    ) as Multicall;
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

  private static getGlvDepositOraclePriceCount(marketCount: number): ethers.BigNumber {
    return ethers.BigNumber.from(2 + marketCount);
  }

  private static getGlvWithdrawalOraclePriceCount(marketCount: number): ethers.BigNumber {
    return ethers.BigNumber.from(3 + marketCount);
  }

  private static adjustGasLimitForEstimate(
    gasEstimate: ethers.BigNumber,
    oraclePriceCount: ethers.BigNumber,
    baseGasLimit: ethers.BigNumber,
    estimatedGasFeePerOracle: ethers.BigNumber,
    multiplierFactor: ethers.BigNumber,
  ): ethers.BigNumber {
    const totalBaseGasLimit = baseGasLimit.add(estimatedGasFeePerOracle.mul(oraclePriceCount));
    return totalBaseGasLimit.add(gasEstimate.mul(multiplierFactor).div(FLOAT_PRECISION));
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
    const glvTokenContract = new ethers.Contract(glvToken, IERC20Abi, this.web3Provider) as IERC20;

    const calls: Multicall__CallStruct[] = [
      {
        target: glvTokenContract.address,
        callData: (await glvTokenContract.populateTransaction.totalSupply()).data!,
      },
      {
        target: this.glvReader!.address,
        callData: (await this.glvReader!.populateTransaction.getGlvInfo(this.gmxV2DataStore!.address, glvToken)).data!,
      },
    ];

    const [
      tokenToSignedPriceMap,
      gmMarket,
      { returnData: multicallResults },
      {
        glvWithdrawalGasLimit,
        glvPerMarketGasLimit,
        swapWithdrawalGasLimit,
        baseGasLimit,
        gasFeePerOracle,
        gasFeeMultiplierFactor,
      },
    ] = await Promise.all([
      GmxV2GmEstimator.getTokenPrices(),
      this.getGmMarketByGlvToken(glvMarket.glvTokenAddress, false),
      this.multicall!.callStatic.aggregate(calls),
      this.getWithdrawalGasLimit(),
    ]);

    const glvTokenSupply = glvTokenContract.interface.decodeFunctionResult(
      'totalSupply',
      multicallResults[0],
    )[0] as ethers.BigNumber;

    const glvPoolInfo = this.glvReader!.interface.decodeFunctionResult(
      'getGlvInfo',
      multicallResults[1],
    )[0] as IGlvReader.GlvInfoStructOutput;

    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = gmMarket.shortTokenAddress;
    const marketToken = gmMarket.marketTokenAddress;
    const marketTokenContract = new ethers.Contract(marketToken, IERC20Abi, this.web3Provider) as IERC20;

    /**
     * Steps to calculate the expected amount out:
     *  1. Get the GLV total supply and pool value
     *  2. Convert the amount of GLV tokens to USD using the pool value and total supply
     *  3. Get the GM market pool value and total supply
     *  4. Use the GLV USD value, GM market pool value, and GM total supply to calculate the amount of GM tokens
     *  5. Get the expected amount of output tokens using the GM amount the same as GmxV2Estimator
     */

    const glvPoolValueTransaction = await this.glvReader!.populateTransaction.getGlvValue(
      this.gmxV2DataStore!.address,
      glvPoolInfo.markets,
      await this.getIndexPricesStruct(tokenToSignedPriceMap, glvPoolInfo.markets),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.longToken),
      GlvEstimator.getPriceStruct(tokenToSignedPriceMap, glvPoolInfo.glv.shortToken),
      glvPoolInfo.glv.glvToken,
      false,
    );
    const marketPoolValueTransaction = await this.gmxV2Reader!.populateTransaction.getMarketTokenPrice(
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
    const marketTokenSupplyTransaction = await marketTokenContract.populateTransaction.totalSupply();

    const { returnData: multicallResults2 } = await this.multicall!.callStatic.aggregate([
      {
        target: this.glvReader!.address,
        callData: glvPoolValueTransaction.data!,
      },
      {
        target: this.gmxV2Reader!.address,
        callData: marketPoolValueTransaction.data!,
      },
      {
        target: marketTokenContract.address,
        callData: marketTokenSupplyTransaction.data!,
      },
    ]);

    const glvPoolValue = this.glvReader!.interface.decodeFunctionResult(
      'getGlvValue',
      multicallResults2[0],
    )[0] as ethers.BigNumber;
    const marketPoolValueStruct = this.gmxV2Reader!.interface.decodeFunctionResult(
      'getMarketTokenPrice',
      multicallResults2[1],
    )[1] as GmxMarketPoolValueInfo.PoolValueInfoPropsStructOutput;
    const marketTokenSupply = marketTokenContract.interface.decodeFunctionResult(
      'totalSupply',
      multicallResults2[2],
    )[0] as ethers.BigNumber;

    const glvTokenUsd = glvPoolValue.mul(amountIn.toFixed()).div(glvTokenSupply);
    const gmAmountOut = marketTokenSupply.mul(glvTokenUsd).div(marketPoolValueStruct.poolValue);

    let gasLimitOverride = glvWithdrawalGasLimit
      .add(glvPerMarketGasLimit.mul(glvPoolInfo.markets.length))
      .add(swapWithdrawalGasLimit);
    gasLimitOverride = GlvEstimator.adjustGasLimitForEstimate(
      gasLimitOverride,
      GlvEstimator.getGlvWithdrawalOraclePriceCount(glvPoolInfo.markets.length),
      baseGasLimit,
      gasFeePerOracle,
      gasFeeMultiplierFactor,
    );

    return this.gmxV2Estimator.getUnwrappedAmount(
      gmMarket,
      new BigNumber(gmAmountOut.toString()),
      outputMarketId,
      marketsMap,
      config,
      tokenToSignedPriceMap,
      gasLimitOverride,
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
    const glvTokenContract = new ethers.Contract(glvToken, IERC20Abi, this.web3Provider) as IERC20;

    const calls: Multicall__CallStruct[] = [
      {
        target: glvTokenContract.address,
        callData: (await glvTokenContract.populateTransaction.totalSupply()).data!,
      },
      {
        target: this.glvReader!.address,
        callData: (await this.glvReader!.populateTransaction.getGlvInfo(this.gmxV2DataStore!.address, glvToken)).data!,
      },
    ];

    const [
      tokenToSignedPriceMap,
      gmMarket,
      { returnData: multicallResults },
      { glvDepositGasLimit, glvPerMarketGasLimit, baseGasLimit, gasFeePerOracle, gasFeeMultiplierFactor },
    ] = await Promise.all([
      GmxV2GmEstimator.getTokenPrices(),
      this.getGmMarketByGlvToken(glvMarket.glvTokenAddress, true),
      this.multicall!.callStatic.aggregate(calls),
      this.getDepositGasLimit(),
    ]);

    const glvTokenSupply = glvTokenContract.interface.decodeFunctionResult(
      'totalSupply',
      multicallResults[0],
    )[0] as ethers.BigNumber;

    const glvPoolInfo = this.glvReader!.interface.decodeFunctionResult(
      'getGlvInfo',
      multicallResults[1],
    )[0] as IGlvReader.GlvInfoStructOutput;

    let gasLimitOverride = glvDepositGasLimit.add(glvPerMarketGasLimit.mul(glvPoolInfo.markets.length));
    gasLimitOverride = GlvEstimator.adjustGasLimitForEstimate(
      gasLimitOverride,
      GlvEstimator.getGlvDepositOraclePriceCount(glvPoolInfo.markets.length),
      baseGasLimit,
      gasFeePerOracle,
      gasFeeMultiplierFactor,
    );

    const inputToken = marketsMap[inputMarketId.toFixed()];

    const indexToken = gmMarket.indexTokenAddress;
    const longToken = gmMarket.longTokenAddress;
    const shortToken = gmMarket.shortTokenAddress;
    const marketToken = gmMarket.marketTokenAddress;

    if (inputToken.tokenAddress !== longToken && inputToken.tokenAddress !== shortToken) {
      return Promise.reject(new Error(`Invalid inputToken, found: ${inputToken.symbol} / ${inputToken.tokenAddress}`));
    }

    const gmAmountOutResult = await this.gmxV2Estimator.getWrappedAmount(
      gmMarket,
      amountIn,
      inputMarketId,
      marketsMap,
      config,
      tokenToSignedPriceMap,
      gasLimitOverride,
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

  private async getGmMarketByGlvToken(glvToken: string, isDeposit: boolean): Promise<GmMarket> {
    let gmMarket = this.dataStoreCache.get(GlvToGmMarketCacheKey(glvToken, isDeposit));
    if (gmMarket) {
      return gmMarket;
    }

    const gmMarketAddress = isDeposit
      ? await this.glvRegistry!.glvTokenToGmMarketForDeposit(glvToken)
      : await this.glvRegistry!.glvTokenToGmMarketForWithdrawal(glvToken);

    const gmMarketsMap = GM_MARKETS_MAP[this.network];
    const gmMarketIsolationModeAddress = Object.keys(gmMarketsMap).find(isolationModeAddress => {
      return gmMarketsMap[isolationModeAddress]!.marketTokenAddress.toLowerCase() === gmMarketAddress.toLowerCase();
    });

    if (gmMarketIsolationModeAddress) {
      gmMarket = GM_MARKETS_MAP[this.network][gmMarketIsolationModeAddress]!;
    } else {
      const result = await this.gmxV2Reader!.getMarket(this.gmxV2DataStore!.address, gmMarketAddress);
      gmMarket = {
        indexTokenAddress: result.indexToken,
        shortTokenAddress: result.shortToken,
        marketTokenAddress: result.marketToken,
        longTokenAddress: result.longToken,
      };
    }

    this.dataStoreCache.set(GlvToGmMarketCacheKey(glvToken, isDeposit), gmMarket);
    return gmMarket;
  }

  private async getWithdrawalGasLimit(): Promise<{
    glvWithdrawalGasLimit: ethers.BigNumber,
    glvPerMarketGasLimit: ethers.BigNumber
    swapWithdrawalGasLimit: ethers.BigNumber,
    baseGasLimit: ethers.BigNumber,
    gasFeePerOracle: ethers.BigNumber,
    gasFeeMultiplierFactor: ethers.BigNumber,
  }> {
    const gasLimit = this.dataStoreCache.get(WithdrawalGasLimitCacheKey);
    if (gasLimit) {
      return gasLimit;
    }

    const { populateTransaction } = this.gmxV2DataStore!;
    const calls: Multicall__CallStruct[] = [
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(GLV_WITHDRAWAL_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(GLV_PER_MARKET_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(SINGLE_SWAP_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_PER_ORACLE_PRICE_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR_KEY)).data!,
      },
    ];

    const { returnData } = await this.multicall!.callStatic.aggregate(calls);

    const glvWithdrawalGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[0],
    )[0] as ethers.BigNumber;

    const glvPerMarketGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[1],
    )[0] as ethers.BigNumber;

    const swapWithdrawalGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[2],
    )[0] as ethers.BigNumber;

    const baseGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[3],
    )[0] as ethers.BigNumber;

    const gasFeePerOracle = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[4],
    )[0] as ethers.BigNumber;

    const gasFeeMultiplierFactor = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[5],
    )[0] as ethers.BigNumber;

    const result = {
      glvWithdrawalGasLimit,
      glvPerMarketGasLimit,
      swapWithdrawalGasLimit,
      baseGasLimit,
      gasFeePerOracle,
      gasFeeMultiplierFactor,
    };
    this.dataStoreCache.set(WithdrawalGasLimitCacheKey, result);

    return result;
  }

  private async getDepositGasLimit(): Promise<{
    glvDepositGasLimit: ethers.BigNumber,
    glvPerMarketGasLimit: ethers.BigNumber
    baseGasLimit: ethers.BigNumber,
    gasFeePerOracle: ethers.BigNumber,
    gasFeeMultiplierFactor: ethers.BigNumber,
  }> {
    const gasLimit = this.dataStoreCache.get(DepositGasLimitCacheKey);
    if (gasLimit) {
      return gasLimit;
    }

    const { populateTransaction } = this.gmxV2DataStore!;
    const calls: Multicall__CallStruct[] = [
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(GLV_DEPOSIT_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(GLV_PER_MARKET_GAS_LIMIT_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_PER_ORACLE_PRICE_KEY)).data!,
      },
      {
        target: this.gmxV2DataStore!.address,
        callData: (await populateTransaction.getUint(ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR_KEY)).data!,
      },
    ];

    const { returnData } = await this.multicall!.callStatic.aggregate(calls);

    const glvDepositGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[0],
    )[0] as ethers.BigNumber;

    const glvPerMarketGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[1],
    )[0] as ethers.BigNumber;

    const baseGasLimit = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[2],
    )[0] as ethers.BigNumber;

    const gasFeePerOracle = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[3],
    )[0] as ethers.BigNumber;

    const gasFeeMultiplierFactor = this.gmxV2DataStore!.interface.decodeFunctionResult(
      'getUint',
      returnData[4],
    )[0] as ethers.BigNumber;

    const result = {
      glvDepositGasLimit,
      glvPerMarketGasLimit,
      baseGasLimit,
      gasFeePerOracle,
      gasFeeMultiplierFactor,
    };
    this.dataStoreCache.set(DepositGasLimitCacheKey, result);

    return result;
  }

  private async getIndexPricesStruct(
    pricesMap: Record<Address, SignedPriceData>,
    markets: Address[],
  ): Promise<PricePropsStruct[]> {
    const transactions = await Promise.all(
      markets.map(m => this.gmxV2Reader!.populateTransaction.getMarket(this.gmxV2DataStore!.address, m)),
    );

    const { returnData } = await this.multicall!.callStatic.aggregate(
      transactions.map(t => ({
        target: this.gmxV2Reader!.address,
        callData: t.data!,
      })),
    );

    return returnData.map(result => {
      const [{ indexToken }] = this.gmxV2Reader!.interface.decodeFunctionResult('getMarket', result);
      return GlvEstimator.getPriceStruct(pricesMap, indexToken);
    });
  }
}
