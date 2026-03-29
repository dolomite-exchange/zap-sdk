import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getPendlePtTransformerTokenForIsolationModeToken,
  isGlvIsolationModeAsset,
  isGmxV2IsolationModeAsset,
  isPendlePtAsset,
  isPendleYtAsset,
  isPOLIsolationModeAsset,
  isSimpleIsolationModeAsset,
} from '../Constants';
import { GM_MARKETS_MAP } from '../GmMarkets';
import { GlvEstimator } from './GlvEstimator';
import { GmxV2GmEstimator } from './GmxV2GmEstimator';
import { PendlePtEstimatorV4 } from './PendlePtEstimatorV4';
import { POLEstimator } from './POLEstimator';
import { SimpleEstimator } from './SimpleEstimator';

export class StandardEstimator {
  private readonly glvEstimator: GlvEstimator;
  private readonly gmxV2GmEstimator: GmxV2GmEstimator;
  private readonly pendlePtEstimatorV4: PendlePtEstimatorV4;
  private readonly polEstimator: POLEstimator;
  private readonly simpleEstimator: SimpleEstimator;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    gasMultiplier: BigNumber,
  ) {
    this.gmxV2GmEstimator = new GmxV2GmEstimator(this.network, this.web3Provider, gasMultiplier);
    this.glvEstimator = new GlvEstimator(this.network, this.web3Provider, this.gmxV2GmEstimator);
    this.pendlePtEstimatorV4 = new PendlePtEstimatorV4(this.network);
    this.polEstimator = new POLEstimator(this.network, this.web3Provider);
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
      const result = await this.pendlePtEstimatorV4.getUnwrappedAmount(
        isolationModeTokenAddress,
        unwrapperAddress,
        amountIn,
        getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );

      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
        return Promise.reject(new Error('PendleYt is deprecated'));
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
      if (!config.additionalMakerAccounts || config.additionalMakerAccounts.length === 0) {
        return Promise.reject(new Error('polEstimator: Missing meta vault account info!'));
      }

      return this.polEstimator.getUnwrappedAmount(amountIn, isolationModeTokenAddress, config.isLiquidation);
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
      const result = await this.pendlePtEstimatorV4.getWrappedAmount(
        isolationModeTokenAddress,
        wrapperAddress,
        amountIn,
        getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
      );
      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
        return Promise.reject(new Error('PendleYt is deprecated'));
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
      if (!config.additionalMakerAccounts || config.additionalMakerAccounts.length === 0) {
        return Promise.reject(new Error('polEstimator: Missing meta vault account info!'));
      }

      return this.polEstimator.getWrappedAmount(amountIn, isolationModeTokenAddress);
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
