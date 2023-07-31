import { ethers } from 'ethers';
import AggregatorClient from './clients/AggregatorClient';
import DolomiteClient from './clients/DolomiteClient';
import ParaswapAggregator from './clients/ParaswapAggregator';
import {
  Address,
  AggregatorOutput,
  ApiMarket,
  ApiMarketHelper,
  ApiToken,
  BlockTag,
  GenericTraderParam,
  GenericTraderType,
  Integer,
  MarketId,
  MinimalApiToken,
  Network,
  ZapConfig,
  ZapOutputParam,
} from './lib/ApiTypes';
import {
  ApiMarketConverter,
  INTEGERS,
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP,
} from './lib/Constants';
import { LocalCache } from './lib/LocalCache';
import { removeDuplicates, toChecksumOpt, zapOutputParamToJson } from './lib/Utils';

const ONE_HOUR = 60 * 60;

const THIRTY_BASIS_POINTS = 0.003;

export class DolomiteZap {
  public readonly network: Network;
  private readonly _defaultIsLiquidation: boolean;
  private client: DolomiteClient;
  private paraswapAggregator: ParaswapAggregator;
  private marketsCache: LocalCache<Record<string, ApiMarket>>;
  private marketHelpersCache: LocalCache<Record<string, ApiMarketHelper>>;
  private validAggregators: AggregatorClient[];

  /**
   * @param network                   The network on which this instance of the Dolomite Zap is running.
   * @param subgraphUrl               The URL of the subgraph to use for fetching market data.
   * @param web3Provider              The web3 provider to use for fetching on-chain data.
   * @param cacheSeconds              The number of seconds to cache market data for. Defaults to 1 hour (3600s).
   * @param defaultIsLiquidation      True if these zaps are for processing liquidations or false for ordinary zaps.
   * @param defaultSlippageTolerance  The default slippage tolerance to use when estimating output. Defaults to 0.3%
   *                                  (0.003).
   * @param defaultBlockTag           The default block tag to use when fetching on-chain data. Defaults to 'latest'.
   * @param partnerAddress            The address of the partner to use for aggregators that allow referral addresses.
   *                                  Defaults to undefined.
   */
  public constructor(
    network: Network,
    subgraphUrl: string,
    web3Provider: ethers.providers.Provider,
    cacheSeconds: number = ONE_HOUR,
    defaultIsLiquidation: boolean = false,
    defaultSlippageTolerance: number = THIRTY_BASIS_POINTS,
    defaultBlockTag: BlockTag = 'latest',
    partnerAddress: Address | undefined = undefined,
  ) {
    this.network = network;
    this._subgraphUrl = subgraphUrl;
    this._web3Provider = web3Provider;
    this._defaultIsLiquidation = defaultIsLiquidation;
    this._defaultSlippageTolerance = defaultSlippageTolerance;
    this._defaultBlockTag = defaultBlockTag;

    this.client = new DolomiteClient(subgraphUrl, network, web3Provider);
    this.paraswapAggregator = new ParaswapAggregator(network, partnerAddress);
    this.marketsCache = new LocalCache<Record<string, ApiMarket>>(cacheSeconds);
    this.marketHelpersCache = new LocalCache<Record<string, ApiMarketHelper>>(cacheSeconds);
    this.validAggregators = [this.paraswapAggregator].filter(aggregator => aggregator.isValidForNetwork());
  }

  private _subgraphUrl: string;

  public get subgraphUrl(): string {
    return this._subgraphUrl;
  }

  public set subgraphUrl(newSubgraphUrl: string) {
    this._subgraphUrl = newSubgraphUrl;
  }

  private _web3Provider: ethers.providers.Provider;

  public get web3Provider(): ethers.providers.Provider {
    return this._web3Provider;
  }

  public set web3Provider(newWeb3Provider: ethers.providers.Provider) {
    this._web3Provider = newWeb3Provider;
  }

  private _defaultSlippageTolerance: number;

  public get defaultSlippageTolerance(): number {
    return this._defaultSlippageTolerance;
  }

  private _defaultBlockTag: BlockTag;

  public get defaultBlockTag(): BlockTag {
    return this._defaultBlockTag;
  }

  public get defaultIsLiquidation(): boolean {
    return this._defaultIsLiquidation;
  }

  public setDefaultSlippageTolerance(slippageTolerance: number): void {
    this._defaultSlippageTolerance = slippageTolerance;
  }

  public setDefaultBlockTag(blockTag: BlockTag): void {
    this._defaultBlockTag = blockTag;
  }

  public setMarketsToAdd(marketsToAdd: ApiMarket[]): void {
    this.client.setMarketsToAdd(marketsToAdd);
  }

  public getIsolationModeConverterByMarketId(marketId: MarketId): ApiMarketConverter | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][marketId.toFixed()];
  }

  public getLiquidityTokenConverterByMarketId(marketId: MarketId): ApiMarketConverter | undefined {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][marketId.toFixed()];
  }

  /**
   *
   * @param tokenIn The input token for the zap
   * @param amountIn The input amount for the zap
   * @param tokenOut The output token for the zap
   * @param amountOutMin The minimum amount out required for the swap to be considered valid
   * @param txOrigin The address that will execute the transaction
   * @param config The additional config for zapping
   * @return {Promise<ZapOutputParam[]>} A list of outputs that can be used to execute the trade. The outputs are
   * sorted by execution, with the best ones being first.
   */
  public async getSwapExactTokensForTokensParams(
    tokenIn: ApiToken | MinimalApiToken,
    amountIn: Integer,
    tokenOut: ApiToken | MinimalApiToken,
    amountOutMin: Integer,
    txOrigin: Address,
    config?: Partial<ZapConfig>,
  ): Promise<ZapOutputParam[]> {
    const actualConfig: ZapConfig = {
      isLiquidation: config?.isLiquidation ?? this.defaultIsLiquidation,
      slippageTolerance: config?.slippageTolerance ?? this.defaultSlippageTolerance,
      blockTag: config?.blockTag ?? this._defaultBlockTag,
      filterOutZapsWithInsufficientOutput: config?.filterOutZapsWithInsufficientOutput ?? true,
    };
    const marketsMap = await this.getMarketIdToMarketMap();
    const marketHelpersMap = await this.getMarketHelpersMap(marketsMap);
    const inputMarket = marketsMap[tokenIn.marketId.toFixed()];
    const inputHelper = marketHelpersMap[tokenIn.marketId.toFixed()];
    const outputMarket = marketsMap[tokenOut.marketId.toFixed()];
    const outputHelper = marketHelpersMap[tokenOut.marketId.toFixed()];

    if (!inputMarket) {
      return Promise.reject(new Error(`Invalid tokenIn: ${tokenIn.symbol} / ${tokenIn.marketId}`));
    } else if (!outputMarket) {
      return Promise.reject(new Error(`Invalid tokenOut: ${tokenOut.symbol} / ${tokenOut.marketId}`));
    } else if (inputMarket.marketId.eq(outputMarket.marketId)) {
      return Promise.reject(new Error(`Duplicate input and output marketId: ${inputMarket.marketId}`));
    } else if (amountIn.lte(INTEGERS.ZERO)) {
      return Promise.reject(new Error('Invalid amountIn. Must be greater than 0'));
    } else if (amountOutMin.lte(INTEGERS.ZERO)) {
      return Promise.reject(new Error('Invalid amountOutMin. Must be greater than 0'));
    } else if (!toChecksumOpt(txOrigin)) {
      return Promise.reject(new Error('Invalid address for txOrigin'));
    } else if (actualConfig.slippageTolerance < 0 || actualConfig.slippageTolerance > 0.1) {
      return Promise.reject(new Error('Invalid slippageTolerance. Must be between 0 and 0.1 (10%)'));
    }

    const amountInWithSlippage = amountIn.multipliedBy(1 - actualConfig.slippageTolerance);
    const marketIdsPath: MarketId[] = [inputMarket.marketId];
    const amountsPaths = new Array<Integer[]>(this.validAggregators.length).fill([amountInWithSlippage]);
    const traderParamsArrays = new Array<GenericTraderParam[]>(this.validAggregators.length).fill([]);
    let effectiveInputMarketId = inputMarket.marketId;
    let effectiveOutputMarketId = outputMarket.marketId;

    const isIsolationModeUnwrapper = inputMarket.isolationModeUnwrapperInfo;
    const unwrapperInfo = inputMarket.isolationModeUnwrapperInfo ?? inputMarket.liquidityTokenUnwrapperInfo;
    const unwrapperHelper = inputHelper.isolationModeUnwrapperHelper ?? inputHelper.liquidityTokenUnwrapperHelper;
    if (unwrapperInfo && unwrapperHelper) {
      effectiveInputMarketId = unwrapperInfo.outputMarketId;
      marketIdsPath.push(effectiveInputMarketId);

      const { amountOut, tradeData } = await unwrapperHelper.estimateOutputFunction(
        amountsPaths[0][0],
        unwrapperInfo.outputMarketId,
        actualConfig,
      );

      amountsPaths.forEach(amountsPath => amountsPath.push(amountOut));
      traderParamsArrays.forEach(traderParams => {
        traderParams.push({
          traderType: isIsolationModeUnwrapper
            ? GenericTraderType.IsolationModeUnwrapper
            : GenericTraderType.ExternalLiquidity,
          makerAccountIndex: 0,
          trader: actualConfig.isLiquidation
            ? (unwrapperInfo.unwrapperForLiquidationAddress ?? unwrapperInfo.unwrapperAddress)
            : unwrapperInfo.unwrapperAddress,
          tradeData,
          readableName: unwrapperInfo.readableName,
        });
      });
    }

    const isIsolationModeWrapper = outputMarket.isolationModeWrapperInfo;
    const wrapperInfo = outputMarket.isolationModeWrapperInfo ?? outputMarket.liquidityTokenWrapperInfo;
    const wrapperHelper = outputHelper.isolationModeWrapperHelper ?? outputHelper.liquidityTokenWrapperHelper;
    if (wrapperInfo) {
      // We can't get the amount yet until we know if we need to use an aggregator in the middle
      effectiveOutputMarketId = wrapperInfo.inputMarketId;
      if (!effectiveInputMarketId.eq(effectiveOutputMarketId)) {
        marketIdsPath.push(wrapperInfo.inputMarketId);
      }
    }

    if (!effectiveInputMarketId.eq(effectiveOutputMarketId)) {
      if (!marketIdsPath.find(marketId => marketId.eq(effectiveOutputMarketId))) {
        marketIdsPath.push(effectiveOutputMarketId);
      }
      const effectiveInputMarket = marketsMap[effectiveInputMarketId.toFixed()];
      const effectiveOutputMarket = marketsMap[effectiveOutputMarketId.toFixed()];
      const aggregatorOutputOrUndefinedList = await Promise.all(
        this.validAggregators.map((aggregator, i) => {
          return aggregator.getSwapExactTokensForTokensData(
            effectiveInputMarket,
            amountsPaths[i][amountsPaths[i].length - 1],
            effectiveOutputMarket,
            INTEGERS.ONE,
            txOrigin,
            actualConfig,
          );
        }),
      );

      const aggregatorOutputs = aggregatorOutputOrUndefinedList.filter(trader => !!trader) as AggregatorOutput[];
      if (aggregatorOutputs.length !== this.validAggregators.length) {
        throw new Error('Invalid aggregator outputs length');
      }

      amountsPaths.forEach((amountsPath, i) => amountsPath.push(aggregatorOutputs[i].expectedAmountOut));
      traderParamsArrays.forEach((traderParams, i) => {
        traderParams.push({
          traderType: GenericTraderType.ExternalLiquidity,
          makerAccountIndex: 0,
          trader: aggregatorOutputs[i].traderAddress,
          tradeData: aggregatorOutputs[i].tradeData,
          readableName: aggregatorOutputs[i].readableName,
        });
      });
    }

    if (wrapperInfo && wrapperHelper) {
      // Append the amounts and trader params for the wrapper
      const amountsAndTraderParams = await Promise.all(
        amountsPaths.map(async (amountsPath) => {
          const amountInForEstimation = amountsPath[amountsPath.length - 1];
          const outputEstimate = await wrapperHelper.estimateOutputFunction(
            amountInForEstimation,
            wrapperInfo.inputMarketId,
            actualConfig,
          );
          const traderParam: GenericTraderParam = {
            traderType: isIsolationModeWrapper
              ? GenericTraderType.IsolationModeWrapper
              : GenericTraderType.ExternalLiquidity,
            makerAccountIndex: 0,
            trader: wrapperInfo.wrapperAddress,
            tradeData: outputEstimate.tradeData,
            readableName: wrapperInfo.readableName,
          };
          return {
            amountOut: outputEstimate.amountOut,
            traderParam,
          };
        }),
      );

      amountsPaths.forEach((amountsPath, i) => {
        amountsPath.push(amountsAndTraderParams[i].amountOut);
        traderParamsArrays[i].push(amountsAndTraderParams[i].traderParam);
      });
    }

    if (!marketIdsPath.find(marketId => marketId.eq(outputMarket.marketId))) {
      marketIdsPath.push(outputMarket.marketId);
    }

    const tokensPath = marketIdsPath.map<ApiToken>(marketId => ({
      marketId,
      symbol: marketsMap[marketId.toFixed()].symbol,
      name: marketsMap[marketId.toFixed()].name,
      tokenAddress: marketsMap[marketId.toFixed()].tokenAddress,
      decimals: marketsMap[marketId.toFixed()].decimals,
    }));
    const result = this.validAggregators.map<ZapOutputParam>((_, i) => {
      amountsPaths[i][0] = amountIn; // overwrite amountIn to be the real one now
      const expectedAmountOut = amountsPaths[i][amountsPaths[i].length - 1]
        .dividedToIntegerBy(1 - actualConfig.slippageTolerance);
      return {
        marketIdsPath,
        tokensPath,
        expectedAmountOut,
        amountWeisPath: amountsPaths[i],
        traderParams: traderParamsArrays[i],
        makerAccounts: [],
        originalAmountOutMin: amountOutMin,
      };
    });

    const zaps = removeDuplicates(result, zapOutputParamToJson);
    if (actualConfig.filterOutZapsWithInsufficientOutput) {
      return zaps.filter(zap => zap.expectedAmountOut.gte(amountOutMin));
    } else {
      return zaps;
    }
  }

  private async getMarketIdToMarketMap(): Promise<Record<string, ApiMarket>> {
    const marketsKey = 'MARKETS';
    const cachedMarkets = this.marketsCache.get(marketsKey);
    if (cachedMarkets) {
      return cachedMarkets;
    }

    const marketsMap = await this.client.getDolomiteMarketsMap();
    this.marketsCache.set(marketsKey, marketsMap);
    return marketsMap;
  }

  private async getMarketHelpersMap(
    marketsMap: Record<string, ApiMarket>,
  ): Promise<Record<string, ApiMarketHelper>> {
    const marketHelpersKey = 'MARKET_HELPERS';
    const cachedMarkets = this.marketHelpersCache.get(marketHelpersKey);
    if (cachedMarkets) {
      return cachedMarkets;
    }

    const marketHelpersMap = await this.client.getDolomiteMarketHelpers(marketsMap);
    this.marketHelpersCache.set(marketHelpersKey, marketHelpersMap);
    return marketHelpersMap;
  }
}
