import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import {
  BYTES_EMPTY,
  getGlpIsolationModeAddress,
  getGlpIsolationModeMarketId,
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  isPtGlpToken,
} from '../Constants';
import { PendlePtEstimator } from './PendlePtEstimator';

export class StandardEstimator {
  private readonly network: Network;
  private readonly web3Provider: ethers.providers.Provider;
  private readonly marketsMap: Record<MarketId, ApiMarket>;
  private readonly pendleEstimator: PendlePtEstimator;

  public constructor(
    network: Network,
    web3Provider: ethers.providers.Provider,
    marketsMap: Record<MarketId, ApiMarket>,
  ) {
    this.network = network;
    this.web3Provider = web3Provider;
    this.marketsMap = marketsMap;
    this.pendleEstimator = new PendlePtEstimator(network, web3Provider);
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    unwrapperAddress: Address,
    amountIn: Integer,
    outputMarketId: number,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const outputMarket = this.marketsMap[outputMarketId];
    const contract = new ethers.Contract(unwrapperAddress, IDolomiteMarginExchangeWrapper, this.web3Provider);

    if (isPtGlpToken(this.network, isolationModeTokenAddress)) {
      const result = await this.pendleEstimator.getUnwrappedAmount(
        isolationModeTokenAddress,
        amountIn,
      );
      const estimateOutputResult = await this.getUnwrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][getGlpIsolationModeMarketId(this.network)!]!.unwrapper,
        result.outputAmount,
        outputMarketId,
        config,
      );
      return { tradeData: result.tradeData, amountOut: estimateOutputResult.amountOut };
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
    inputMarketId: number,
    config: ZapConfig,
  ): Promise<EstimateOutputResult> {
    const inputMarket = this.marketsMap[inputMarketId];

    if (isPtGlpToken(this.network, isolationModeTokenAddress)) {
      const estimateOutputResult = await this.getWrappedAmount(
        getGlpIsolationModeAddress(this.network)!,
        ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][getGlpIsolationModeMarketId(this.network)!]!.wrapper,
        amountIn,
        inputMarketId,
        config,
      );
      const result = await this.pendleEstimator.getWrappedAmount(
        isolationModeTokenAddress,
        estimateOutputResult.amountOut,
      );
      return { tradeData: result.tradeData, amountOut: result.ptAmountOut };
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
