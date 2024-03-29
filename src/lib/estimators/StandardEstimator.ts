import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getGlpIsolationModeMarketId,
  getPendlePtTransformerTokenForIsolationModeToken,
  getPendleYtTransformerTokenForIsolationModeToken,
  isGmxV2IsolationModeAsset,
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  isPendlePtAsset,
  isPendlePtGlpAsset,
  isPendleYtAsset,
  isPendleYtGlpAsset,
  isSimpleIsolationModeAsset,
} from '../Constants';
import { GmxV2GmEstimator } from './GmxV2GmEstimator';
import { PendlePtEstimatorV2 } from './PendlePtEstimatorV2';
import { PendlePtEstimatorV3 } from './PendlePtEstimatorV3';
import { PendleYtEstimatorV2 } from './PendleYtEstimatorV2';
import { PendleYtEstimatorV3 } from './PendleYtEstimatorV3';
import { SimpleEstimator } from './SimpleEstimator';

export class StandardEstimator {
  private readonly gmxV2GmEstimator: GmxV2GmEstimator;
  private readonly pendlePtEstimatorV2: PendlePtEstimatorV2;
  private readonly pendlePtEstimatorV3: PendlePtEstimatorV3;
  private readonly pendleYtEstimatorV2: PendleYtEstimatorV2;
  private readonly pendleYtEstimatorV3: PendleYtEstimatorV3;
  private readonly simpleEstimator: SimpleEstimator;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
    private readonly usePendleV3: boolean,
    gasMultiplier: BigNumber,
  ) {
    this.gmxV2GmEstimator = new GmxV2GmEstimator(this.network, this.web3Provider, gasMultiplier);
    this.pendlePtEstimatorV2 = new PendlePtEstimatorV2(this.network, this.web3Provider);
    this.pendlePtEstimatorV3 = new PendlePtEstimatorV3(this.network);
    this.pendleYtEstimatorV2 = new PendleYtEstimatorV2(this.network, this.web3Provider);
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
      const result = await (
        this.usePendleV3
          ? this.pendlePtEstimatorV3.getUnwrappedAmount(
            isolationModeTokenAddress,
            unwrapperAddress,
            amountIn,
            getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
          : this.pendlePtEstimatorV2.getUnwrappedAmount(
            isolationModeTokenAddress,
            amountIn,
            getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
      );

      if (isPendlePtGlpAsset(this.network, isolationModeTokenAddress)) {
        const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
        const glpResult = await this.getUnwrappedAmount(
          marketsMap[glpMarketId.toFixed()].tokenAddress,
          ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.unwrapper,
          result.amountOut,
          marketsMap[glpMarketId.toFixed()].isolationModeUnwrapperInfo!.outputMarketIds[0],
          config,
          marketsMap,
        );
        return { tradeData: result.tradeData, amountOut: glpResult.amountOut };
      }

      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
      const result = await (
        this.usePendleV3
          ? this.pendleYtEstimatorV3.getUnwrappedAmount(
            isolationModeTokenAddress,
            unwrapperAddress,
            amountIn,
            getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
          : this.pendleYtEstimatorV2.getUnwrappedAmount(
            isolationModeTokenAddress,
            amountIn,
            getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
      );

      if (isPendleYtGlpAsset(this.network, isolationModeTokenAddress)) {
        const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
        const glpResult = await this.getUnwrappedAmount(
          marketsMap[glpMarketId.toFixed()].tokenAddress,
          ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.unwrapper,
          result.amountOut,
          marketsMap[glpMarketId.toFixed()].isolationModeUnwrapperInfo!.outputMarketIds[0],
          config,
          marketsMap,
        );
        return { tradeData: result.tradeData, amountOut: glpResult.amountOut };
      }

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
      let newAmountIn = amountIn;
      if (isPendlePtGlpAsset(this.network, isolationModeTokenAddress)) {
        const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
        const estimateOutputResult = await this.getWrappedAmount(
          marketsMap[glpMarketId.toFixed()].tokenAddress,
          ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.wrapper,
          amountIn,
          inputMarketId,
          config,
          marketsMap,
        );
        newAmountIn = estimateOutputResult.amountOut;
      }

      const result = await (
        this.usePendleV3
          ? this.pendlePtEstimatorV3.getWrappedAmount(
            isolationModeTokenAddress,
            wrapperAddress,
            newAmountIn,
            getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
          : this.pendlePtEstimatorV2.getWrappedAmount(
            isolationModeTokenAddress,
            newAmountIn,
            getPendlePtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
      );
      return { tradeData: result.tradeData, amountOut: result.amountOut };
    } else if (isPendleYtAsset(this.network, isolationModeTokenAddress)) {
      let newAmountIn = amountIn;
      if (isPendleYtGlpAsset(this.network, isolationModeTokenAddress)) {
        const glpMarketId = getGlpIsolationModeMarketId(this.network)!;
        const estimateOutputResult = await this.getWrappedAmount(
          marketsMap[glpMarketId.toFixed()].tokenAddress,
          ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][glpMarketId.toFixed()]!.wrapper,
          amountIn,
          inputMarketId,
          config,
          marketsMap,
        );
        newAmountIn = estimateOutputResult.amountOut;
      }

      return (
        this.usePendleV3
          ? this.pendleYtEstimatorV3.getWrappedAmount(
            isolationModeTokenAddress,
            wrapperAddress,
            newAmountIn,
            getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
          : this.pendleYtEstimatorV2.getWrappedAmount(
            isolationModeTokenAddress,
            newAmountIn,
            getPendleYtTransformerTokenForIsolationModeToken(this.network, isolationModeTokenAddress)!,
          )
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
