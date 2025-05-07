import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getPendlePtTransformerTokenForIsolationModeToken,
  getPendleYtTransformerTokenForIsolationModeToken, isGlvIsolationModeAsset,
  isGmxV2IsolationModeAsset,
  isPendlePtAsset,
  isPendleYtAsset,
  isPOLIsolationModeAsset,
  isSimpleIsolationModeAsset,
} from '../Constants';
import { GM_MARKETS_MAP } from '../GmMarkets';
import { GlvEstimator } from './GlvEstimator';
import { GmxV2GmEstimator } from './GmxV2GmEstimator';
import { PendlePtEstimatorV3 } from './PendlePtEstimatorV3';
import { PendleYtEstimatorV3 } from './PendleYtEstimatorV3';
import { POLEstimator } from './POLEstimator';
import { SimpleEstimator } from './SimpleEstimator';

export class StandardEstimator {
  private readonly glvEstimator: GlvEstimator;
  private readonly gmxV2GmEstimator: GmxV2GmEstimator;
  private readonly pendlePtEstimatorV3: PendlePtEstimatorV3;
  private readonly pendleYtEstimatorV3: PendleYtEstimatorV3;
  private readonly polEstimator: POLEstimator;
  private readonly simpleEstimator: SimpleEstimator;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    gasMultiplier: BigNumber,
  ) {
    this.gmxV2GmEstimator = new GmxV2GmEstimator(this.network, this.web3Provider, gasMultiplier);
    this.glvEstimator = new GlvEstimator(this.network, this.web3Provider, this.gmxV2GmEstimator);
    this.pendlePtEstimatorV3 = new PendlePtEstimatorV3(this.network);
    this.pendleYtEstimatorV3 = new PendleYtEstimatorV3(this.network);
    this.polEstimator = new POLEstimator(this.network, this.web3Provider);
    this.simpleEstimator = new SimpleEstimator();
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    unwrapperAddress: Address,
    amountIn: Integer,
    inputMarketId: MarketId,
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
    } else if (isGlvIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.glvEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        outputMarketId,
        marketsMap,
        config,
      );
    } else if (isGmxV2IsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.gmxV2GmEstimator.getUnwrappedAmount(
        GM_MARKETS_MAP[this.network]![isolationModeTokenAddress]!,
        amountIn,
        outputMarketId,
        marketsMap,
        config,
      );
    } else if (isPOLIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.polEstimator.getUnwrappedAmount(
        amountIn,
        inputMarketId,
        outputMarketId,
        config.isLiquidation,
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
        GM_MARKETS_MAP[this.network]![isolationModeTokenAddress]!,
        amountIn,
        inputMarketId,
        marketsMap,
        config,
      );
    } else if (isGlvIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.glvEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        amountIn,
        inputMarketId,
        marketsMap,
        config,
      );
    } else if (isPOLIsolationModeAsset(this.network, isolationModeTokenAddress)) {
      return this.polEstimator.getWrappedAmount(
        amountIn,
        inputMarketId
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
