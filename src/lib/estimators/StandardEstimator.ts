import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getPendlePtTransformerTokenForIsolationModeToken,
  getPendleYtTransformerTokenForIsolationModeToken,
  isGammaIsolationModeAsset,
  isGmxV2IsolationModeAsset,
  isPendlePtAsset,
  isPendleYtAsset,
  isSimpleIsolationModeAsset,
} from '../Constants';
import { GmxV2GmEstimator } from './GmxV2GmEstimator';
import { PendlePtEstimatorV3 } from './PendlePtEstimatorV3';
import { PendleYtEstimatorV3 } from './PendleYtEstimatorV3';
import { SimpleEstimator } from './SimpleEstimator';
import { GammaEstimator } from './GammaEstimator';
import AggregatorClient from '../../clients/AggregatorClient';

export class StandardEstimator {
  private readonly gammaEstimator: GammaEstimator;
  private readonly gmxV2GmEstimator: GmxV2GmEstimator;
  private readonly pendlePtEstimatorV3: PendlePtEstimatorV3;
  private readonly pendleYtEstimatorV3: PendleYtEstimatorV3;
  private readonly simpleEstimator: SimpleEstimator;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    private readonly validAggregators: AggregatorClient[],
    gasMultiplier: BigNumber,
  ) {
    this.gammaEstimator = new GammaEstimator(this.network, this.web3Provider, this.validAggregators[0]);
    this.gmxV2GmEstimator = new GmxV2GmEstimator(this.network, this.web3Provider, gasMultiplier);
    this.pendlePtEstimatorV3 = new PendlePtEstimatorV3(this.network);
    this.pendleYtEstimatorV3 = new PendleYtEstimatorV3(this.network);
    this.simpleEstimator = new SimpleEstimator();
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

    if (isPendlePtAsset(this.network, isolationModeTokenAddress)) {
      const result = await this.pendlePtEstimatorV3.getUnwrappedAmount(
        isolationModeTokenAddress,
        unwrapperAddress,
        amountIn,
        getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );

      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
      const result = await this.pendleYtEstimatorV3.getUnwrappedAmount(
        isolationModeTokenAddress,
        unwrapperAddress,
        amountIn,
        getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );

      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isSimpleIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.simpleEstimator.getUnwrappedAmount(amountIn);
    } else if (isGmxV2IsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.gmxV2GmEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        outputMarketId,
        marketsMap,
        config,
      );
    } else if (isGammaIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.gammaEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        outputMarketId,
        marketsMap,
        config,
      );
    } else {
      // fallback is to call getExchangeCost
      const contract = new ethers.Contract(unwrapperAddress, IDolomiteMarginExchangeWrapper, this.web3Provider);
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

    if (isPendlePtAsset(this.network, isolationModeTokenAddress)) {
      const result = await this.pendlePtEstimatorV3.getWrappedAmount(
        isolationModeTokenAddress,
        wrapperAddress,
        amountIn,
        getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );
      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
      return this.pendleYtEstimatorV3.getWrappedAmount(
        isolationModeTokenAddress,
        wrapperAddress,
        amountIn,
        getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );
    } else if (isSimpleIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.simpleEstimator.getWrappedAmount(amountIn);
    } else if (isGmxV2IsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.gmxV2GmEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        inputMarketId,
        marketsMap,
        config,
      );
    } else if (isGammaIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.gammaEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        inputMarketId,
        marketsMap,
        config,
      );
    } else {
      const contract = new ethers.Contract(wrapperAddress, IDolomiteMarginExchangeWrapper, this.web3Provider);
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
