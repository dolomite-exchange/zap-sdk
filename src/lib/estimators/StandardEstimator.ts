import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getGlpIsolationModeAddress,
  getGlpIsolationModeMarketId,
  getREthAddress,
  getSGlpAddress,
  getWstEthAddress,
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  isPtGlpToken,
  isPtREthToken,
  isPtWstEthJun2024Token,
  isPtWstEthJun2025Token,
  isSimpleIsolationModeAsset,
  isYtGlpToken,
} from '../Constants';
import { PendlePtEstimator } from './PendlePtEstimator';
import { PendleYtEstimator } from './PendleYtEstimator';
import { SimpleEstimator } from './SimpleEstimator';

export class StandardEstimator {
  private readonly network: Network;

  public constructor(
    network: Network,
    web3Provider: ethers.providers.Provider,
  ) {
    this.network = network;
    this._web3Provider = web3Provider;
  }

  private _web3Provider: ethers.providers.Provider;

  public set web3Provider(web3Provider: ethers.providers.Provider) {
    this._web3Provider = web3Provider;
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    unwrapperAddress: Address,
    amountIn: Integer,
    outputMarketId: MarketId,
    config: ZapConfig,
    marketsMap: Record<string, ApiMarket>,
  ): Promise<EstimateOutputResult> {
    const outputMarket = marketsMap[outputMarketId.toFixed()];
    const contract = new ethers.Contract(unwrapperAddress, IDolomiteMarginExchangeWrapper, this._web3Provider);

    if (isPtGlpToken(this.network, isolationModeTokenAddress)) {
      const pendlePtEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      const result = await pendlePtEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getSGlpAddress(this.network) as Address,
      );
      const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
      const estimateOutputResult = await this.getUnwrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.unwrapper,
        result.amountOut,
        outputMarketId,
        config,
        marketsMap,
      );
      return { tradeData: result.tradeData, amountOut: estimateOutputResult.amountOut };
    } else if (isPtREthToken(this.network, isolationModeTokenAddress)) {
      const pendlePtEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      return pendlePtEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getREthAddress(this.network) as Address,
      );
    } else if (
      isPtWstEthJun2024Token(this.network, isolationModeTokenAddress)
      || isPtWstEthJun2025Token(this.network, isolationModeTokenAddress)
    ) {
      const pendlePtEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      return pendlePtEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getWstEthAddress(this.network) as Address,
      );
    } else if (isYtGlpToken(this.network, isolationModeTokenAddress)) {
      const pendleYtEstimator = new PendleYtEstimator(this.network, this._web3Provider);
      const result = await pendleYtEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getSGlpAddress(this.network) as Address,
      );
      const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
      const estimateOutputResult = await this.getUnwrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.unwrapper,
        result.amountOut,
        outputMarketId,
        config,
        marketsMap,
      );
      return { tradeData: result.tradeData, amountOut: estimateOutputResult.amountOut };
    } else if (isSimpleIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      const estimator = new SimpleEstimator();
      return estimator.getUnwrappedAmount(amountIn);
    } else {
      // fallback is to call getExchangeCost
      const tradeData = BYTES_EMPTY;
      const outputAmount = await contract.getExchangeCost(
        isolationModeTokenAddress,
        outputMarket.tokenAddress,
        amountIn.toFixed(),
        tradeData,
      );
      const amountOut = new BigNumber(outputAmount.toString());
      return { amountOut, tradeData };
    }
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    wrapperAddress: Address,
    amountIn: Integer,
    inputMarketId: MarketId,
    config: ZapConfig,
    marketsMap: Record<string, ApiMarket>,
  ): Promise<EstimateOutputResult> {
    const inputMarket = marketsMap[inputMarketId.toFixed()];

    if (isPtGlpToken(this.network, isolationModeTokenAddress)) {
      const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
      const estimateOutputResult = await this.getWrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.wrapper,
        amountIn,
        inputMarketId,
        config,
        marketsMap,
      );
      const pendleEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      const result = await pendleEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        estimateOutputResult.amountOut,
        getSGlpAddress(this.network) as Address,
      );
      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPtREthToken(this.network, isolationModeTokenAddress)) {
      const pendlePtEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      return pendlePtEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getREthAddress(this.network) as Address,
      );
    } else if (
      isPtWstEthJun2024Token(this.network, isolationModeTokenAddress)
      || isPtWstEthJun2025Token(this.network, isolationModeTokenAddress)
    ) {
      const pendlePtEstimator = new PendlePtEstimator(this.network, this._web3Provider);
      return pendlePtEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        getWstEthAddress(this.network) as Address,
      );
    } else if (isYtGlpToken(this.network, isolationModeTokenAddress)) {
      const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
      const estimateOutputResult = await this.getWrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.wrapper,
        amountIn,
        inputMarketId,
        config,
        marketsMap,
      );
      const pendleEstimator = new PendleYtEstimator(this.network, this._web3Provider);
      const result = await pendleEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        estimateOutputResult.amountOut,
        getSGlpAddress(this.network) as Address,
      );
      return { tradeData: result.tradeData, amountOut: result.ytAmountOut };
    } else if (isSimpleIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      const estimator = new SimpleEstimator();
      return estimator.getWrappedAmount(amountIn);
    } else {
      const contract = new ethers.Contract(wrapperAddress, IDolomiteMarginExchangeWrapper, this._web3Provider);
      const tradeData = BYTES_EMPTY;
      const outputAmount = await contract.getExchangeCost(
        inputMarket.tokenAddress,
        isolationModeTokenAddress,
        amountIn.toFixed(),
        tradeData,
      );
      const amountOut = new BigNumber(outputAmount.toString());
      return { amountOut, tradeData };
    }
  }
}
