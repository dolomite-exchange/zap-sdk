import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import AggregatorClient from './clients/AggregatorClient';
import DolomiteClient from './clients/DolomiteClient';
import OdosAggregator from './clients/OdosAggregator';
import ParaswapAggregator from './clients/ParaswapAggregator';
import {
  Address,
  ApiAsyncAction,
  ApiAsyncActionType,
  ApiAsyncTradeType,
  ApiMarket,
  ApiMarketHelper,
  ApiOraclePrice,
  ApiToken,
  BlockTag,
  EstimateOutputResult,
  GenericTraderParam,
  GenericTraderType,
  Integer,
  MarketId,
  MinimalApiToken,
  Network,
  ReferralOutput,
  ZapConfig,
  ZapOutputParam,
} from './lib/ApiTypes';
import {
  ADDRESS_ZERO,
  ApiMarketConverter,
  BYTES_EMPTY,
  getGmxV2IsolationModeAsset,
  INTEGERS,
  INVALID_NAME,
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP,
} from './lib/Constants';
import { LocalCache } from './lib/LocalCache';
import Logger from './lib/Logger';
import { toChecksumOpt, zapOutputParamIsInvalid } from './lib/Utils';

const ONE_HOUR = 60 * 60;

const THIRTY_BASIS_POINTS = 0.003;

const marketsKey = 'MARKETS';
const marketHelpersKey = 'MARKET_HELPERS';

const INVALID_ESTIMATION = {
  amountOut: INTEGERS.NEGATIVE_ONE,
  tradeData: BYTES_EMPTY,
  extraData: undefined,
};

export interface DolomiteZapConfig {
  /**
   * The network on which this instance of the Dolomite Zap is running.
   */
  network: Network,
  /**
   * The URL of the subgraph to use for fetching market data.
   */
  subgraphUrl: string,
  /**
   * The web3 provider to use for fetching on-chain data.
   */
  web3Provider: ethers.providers.Provider,
  /**
   * The number of seconds to cache market data for. Defaults to 1 hour (3600s).
   */
  cacheSeconds?: number;
  /**
   * True if these zaps are for processing liquidations or false for ordinary zaps.
   */
  defaultIsLiquidation?: boolean;
  /**
   * The default slippage tolerance to use when estimating output. Defaults to 0.3% (0.003).
   */
  defaultSlippageTolerance?: number;
  /**
   * The default block tag to use when fetching on-chain data. Defaults to 'latest'.
   */
  defaultBlockTag?: BlockTag;
  /**
   * The referral information to use for the various aggregators. Defaults to undefined.
   */
  referralInfo?: ReferralOutput;
  /**
   * True if the Dolomite proxy server should be used for aggregators that support it. The proxy server is used to make
   * the API requests consistent and prevent browser plugins from blocking requests. Defaults to true.
   */
  useProxyServer?: boolean;
  /**
   * True to use the Pendle V3 router, false to use V2. Defaults to `false`.
   */
  usePendleV3?: boolean;
  /**
   * The multiplier to apply to any gas prices being used for estimating execution fees for intent-driven calls (like
   * GMX V2).
   */
  gasMultiplier?: BigNumber;
}

export class DolomiteZap {
  public readonly network: Network;
  public readonly validAggregators: AggregatorClient[];
  private readonly _defaultIsLiquidation: boolean;
  private client: DolomiteClient;
  private marketsCache: LocalCache<Record<string, ApiMarket>>;
  private marketHelpersCache: LocalCache<Record<string, ApiMarketHelper>>;
  private readonly _web3Provider: ethers.providers.Provider;

  public constructor(
    {
      network,
      subgraphUrl,
      web3Provider,
      cacheSeconds = ONE_HOUR,
      defaultIsLiquidation = false,
      defaultSlippageTolerance = THIRTY_BASIS_POINTS,
      defaultBlockTag = 'latest',
      referralInfo = {
        odosReferralCode: undefined,
        referralAddress: undefined,
      },
      useProxyServer = true,
      usePendleV3 = false,
      gasMultiplier = new BigNumber('1'),
    }: DolomiteZapConfig,
  ) {
    this.network = network;
    this._subgraphUrl = subgraphUrl;
    this._web3Provider = web3Provider;
    this._defaultIsLiquidation = defaultIsLiquidation;
    this._defaultSlippageTolerance = defaultSlippageTolerance;
    this._defaultBlockTag = defaultBlockTag;

    this.client = new DolomiteClient(network, subgraphUrl, web3Provider, usePendleV3, gasMultiplier);
    this.marketsCache = new LocalCache<Record<string, ApiMarket>>(cacheSeconds);
    this.marketHelpersCache = new LocalCache<Record<string, ApiMarketHelper>>(cacheSeconds);

    this.validAggregators = this.getAllAggregators(network, referralInfo, useProxyServer)
      .filter(aggregator => aggregator.isValidForNetwork());
  }

  private _subgraphUrl: string;

  public get subgraphUrl(): string {
    return this._subgraphUrl;
  }

  public set subgraphUrl(newSubgraphUrl: string) {
    this._subgraphUrl = newSubgraphUrl;
    this.client.subgraphUrl = newSubgraphUrl;
  }

  public get web3Provider(): ethers.providers.Provider {
    return this._web3Provider;
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

  public async forceRefreshCache(): Promise<void> {
    await this.getMarketIdToMarketMap(true);
  }

  public getIsAsyncAssetByMarketId(marketId: MarketId): boolean {
    return !!this.getIsolationModeConverterByMarketId(marketId)?.isAsync;
  }

  public getAsyncAssetOutputMarketsByMarketId(marketId: MarketId): MarketId[] | undefined {
    const cachedMarkets = this.marketsCache.get(marketsKey);
    if (!cachedMarkets) {
      return undefined;
    }

    const market = cachedMarkets[marketId.toFixed()];
    if (!market) {
      return undefined;
    }
    const gmMarket = getGmxV2IsolationModeAsset(this.network, market.tokenAddress);
    if (!gmMarket) {
      return undefined;
    }

    return [gmMarket.longTokenId, gmMarket.shortTokenId];
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
      isVaporizable: config?.isVaporizable ?? false,
      slippageTolerance: config?.slippageTolerance ?? this.defaultSlippageTolerance,
      blockTag: config?.blockTag ?? this._defaultBlockTag,
      filterOutZapsWithInsufficientOutput: config?.filterOutZapsWithInsufficientOutput ?? true,
      subAccountNumber: config?.subAccountNumber,
      disallowAggregator: config?.disallowAggregator ?? false,
    };
    const marketsMap = await this.getMarketIdToMarketMap(false);
    const marketHelpersMap = await this.getMarketHelpersMap(marketsMap);
    const inputMarket = marketsMap[tokenIn.marketId.toFixed()];
    const inputHelper = marketHelpersMap[tokenIn.marketId.toFixed()];
    const outputMarket = marketsMap[tokenOut.marketId.toFixed()];
    const outputHelper = marketHelpersMap[tokenOut.marketId.toFixed()];

    if (!inputMarket) {
      return Promise.reject(new Error(`Invalid tokenIn: ${tokenIn.symbol} / ${tokenIn.marketId}`));
    } else if (!outputMarket) {
      return Promise.reject(new Error(`Invalid tokenOut: ${tokenOut.symbol} / ${tokenOut.marketId}`));
    } else if (amountIn.lte(INTEGERS.ZERO)) {
      return Promise.reject(new Error('Invalid amountIn. Must be greater than 0'));
    } else if (amountOutMin.lte(INTEGERS.ZERO)) {
      return Promise.reject(new Error('Invalid amountOutMin. Must be greater than 0'));
    } else if (!toChecksumOpt(txOrigin)) {
      return Promise.reject(new Error('Invalid address for txOrigin'));
    } else if (actualConfig.slippageTolerance < 0 || actualConfig.slippageTolerance > 0.1) {
      return Promise.reject(new Error('Invalid slippageTolerance. Must be between 0 and 0.1 (10%)'));
    }

    let marketIdsPaths: MarketId[][] = [];
    let amountsPaths: BigNumber[][] = [];
    let traderParamsArrays: GenericTraderParam[][] = [];
    let executionFees: BigNumber[] = [];
    let effectiveInputMarketIds = [inputMarket.marketId];
    let effectiveOutputMarketIds = [outputMarket.marketId];

    const isIsolationModeUnwrapper = inputMarket.isolationModeUnwrapperInfo;
    const unwrapperInfo = inputMarket.isolationModeUnwrapperInfo ?? inputMarket.liquidityTokenUnwrapperInfo;
    const unwrapperHelper = inputHelper.isolationModeUnwrapperHelper ?? inputHelper.liquidityTokenUnwrapperHelper;
    if (unwrapperInfo && unwrapperHelper) {
      effectiveInputMarketIds = unwrapperInfo.outputMarketIds;

      const estimateResults = await Promise.all(
        effectiveInputMarketIds.map((inputMarketId, i) => {
          marketIdsPaths[i] = [inputMarket.marketId];
          amountsPaths[i] = [amountIn];

          return unwrapperHelper.estimateOutputFunction(
            amountIn,
            inputMarketId,
            actualConfig,
          ).catch(e => {
            Logger.error({
              message: `Caught error while estimating wrapping: ${e.message}`,
              error: e,
            });
            return INVALID_ESTIMATION;
          });
        }),
      );

      estimateResults.forEach(({ amountOut, tradeData, extraData }, i) => {
        marketIdsPaths[i] = marketIdsPaths[i].concat(effectiveInputMarketIds[i]);
        amountsPaths[i] = amountsPaths[i].concat(amountOut);
        traderParamsArrays[i] = [
          {
            traderType: isIsolationModeUnwrapper
              ? GenericTraderType.IsolationModeUnwrapper
              : GenericTraderType.ExternalLiquidity,
            makerAccountIndex: 0,
            trader: actualConfig.isLiquidation
              ? (unwrapperInfo.unwrapperForLiquidationAddress ?? unwrapperInfo.unwrapperAddress)
              : unwrapperInfo.unwrapperAddress,
            tradeData,
            readableName: unwrapperInfo.readableName,
          },
        ];
        executionFees[i] = extraData?.executionFee ?? INTEGERS.ZERO;
      });
    } else {
      marketIdsPaths[0] = [inputMarket.marketId];
      amountsPaths[0] = [amountIn];
      traderParamsArrays[0] = [];
      executionFees[0] = INTEGERS.ZERO;
    }

    const isIsolationModeWrapper = outputMarket.isolationModeWrapperInfo;
    const wrapperInfo = outputMarket.isolationModeWrapperInfo ?? outputMarket.liquidityTokenWrapperInfo;
    const wrapperHelper = outputHelper.isolationModeWrapperHelper ?? outputHelper.liquidityTokenWrapperHelper;
    if (wrapperInfo) {
      // We can't get the amount yet until we know if we need to use an aggregator in the middle
      effectiveOutputMarketIds = wrapperInfo.inputMarketIds;
      [
        marketIdsPaths,
        amountsPaths,
        traderParamsArrays,
        executionFees,
      ] = effectiveOutputMarketIds.reduce((acc, outputMarketId) => {
        marketIdsPaths.forEach((path, i) => {
          if (!outputMarketId.eq(path[path.length - 1])) {
            acc[0].push(path.concat(outputMarketId));
            acc[1].push([...amountsPaths[i]]);
            acc[2].push([...traderParamsArrays[i]]);
            acc[3].push(...executionFees);
          } else {
            acc[0].push(path);
            acc[1].push([...amountsPaths[i]]);
            acc[2].push([...traderParamsArrays[i]]);
            acc[3].push(...executionFees);
          }
        });
        return acc;
      }, [[] as MarketId[][], [] as BigNumber[][], [] as GenericTraderParam[][], [] as BigNumber[]])
    }

    if (
      effectiveInputMarketIds.length !== marketIdsPaths.length
      && effectiveOutputMarketIds.length !== marketIdsPaths.length
    ) {
      // eslint-disable-next-line max-len
      return Promise.reject(new Error(`Developer error: marketIds length does not match <${effectiveInputMarketIds.length}, ${marketIdsPaths.length}>`));
    } else if (marketIdsPaths.length !== amountsPaths.length) {
      // eslint-disable-next-line max-len
      return Promise.reject(new Error(`Developer error: amountsPaths length does not match <${amountsPaths.length}, ${marketIdsPaths.length}>`));
    }

    for (let i = 0; i < effectiveInputMarketIds.length; i += 1) {
      const effectiveInputMarketId = effectiveInputMarketIds[i];
      for (let j = 0; j < effectiveOutputMarketIds.length; j += 1) {
        const c = i * effectiveOutputMarketIds.length + j;
        const effectiveOutputMarketId = effectiveOutputMarketIds[j];
        if (!effectiveInputMarketId.eq(effectiveOutputMarketId)) {
          const effectiveInputMarket = marketsMap[effectiveInputMarketId.toFixed()];
          const effectiveOutputMarket = marketsMap[effectiveOutputMarketId.toFixed()];
          const aggregatorOutputOrUndefinedList = await Promise.all(
            this.validAggregators.map(async aggregator => {
              if (actualConfig.disallowAggregator) {
                return undefined;
              }

              try {
                return await aggregator.getSwapExactTokensForTokensData(
                  effectiveInputMarket,
                  amountsPaths[c][amountsPaths[c].length - 1],
                  effectiveOutputMarket,
                  INTEGERS.ONE,
                  txOrigin,
                  actualConfig,
                );
              } catch (e) {
                return undefined;
              }
            }),
          );

          // eslint-disable-next-line no-loop-func
          aggregatorOutputOrUndefinedList.forEach((aggregatorOutput, aggregatorIndex) => {
            if (aggregatorIndex === 0) {
              amountsPaths[c] = amountsPaths[c].concat(aggregatorOutput?.expectedAmountOut ?? INTEGERS.NEGATIVE_ONE);
              traderParamsArrays[c] = traderParamsArrays[c].concat({
                traderType: GenericTraderType.ExternalLiquidity,
                makerAccountIndex: 0,
                trader: aggregatorOutput?.traderAddress ?? ADDRESS_ZERO,
                tradeData: aggregatorOutput?.tradeData ?? BYTES_EMPTY,
                readableName: aggregatorOutput?.readableName ?? INVALID_NAME,
              });
            } else {
              marketIdsPaths.push([...marketIdsPaths[c]]);
              amountsPaths.push(
                [...amountsPaths[c]].concat(aggregatorOutput?.expectedAmountOut ?? INTEGERS.NEGATIVE_ONE),
              );
              traderParamsArrays.push(
                [...traderParamsArrays[c]].concat({
                  traderType: GenericTraderType.ExternalLiquidity,
                  makerAccountIndex: 0,
                  trader: aggregatorOutput?.traderAddress ?? ADDRESS_ZERO,
                  tradeData: aggregatorOutput?.tradeData ?? BYTES_EMPTY,
                  readableName: aggregatorOutput?.readableName ?? INVALID_NAME,
                }),
              );
              executionFees.push(executionFees[c]);
            }
          });
        }
      }
    }

    if (wrapperInfo && wrapperHelper) {
      // Append the amounts and trader params for the wrapper
      await Promise.all(
        marketIdsPaths.map(async (marketIdsPath, i) => {
          const amountsPath = amountsPaths[i];
          let outputEstimate: EstimateOutputResult
          if (amountsPath.some(a => a.eq(INVALID_ESTIMATION.amountOut))) {
            outputEstimate = INVALID_ESTIMATION;
          } else {
            outputEstimate = await wrapperHelper.estimateOutputFunction(
              amountsPath[amountsPath.length - 1],
              marketIdsPath[marketIdsPath.length - 1],
              actualConfig,
            ).catch(e => {
              Logger.error({
                message: `Caught error while estimating wrapping: ${e.message}`,
                error: e,
              });
              return INVALID_ESTIMATION;
            });
          }

          marketIdsPath.push(outputMarket.marketId);
          amountsPath.push(outputEstimate.amountOut);
          traderParamsArrays[i].push({
            traderType: isIsolationModeWrapper
              ? GenericTraderType.IsolationModeWrapper
              : GenericTraderType.ExternalLiquidity,
            makerAccountIndex: 0,
            trader: wrapperInfo.wrapperAddress,
            tradeData: outputEstimate.tradeData,
            readableName: outputEstimate.amountOut.eq(INVALID_ESTIMATION.amountOut)
              ? INVALID_NAME
              : wrapperInfo.readableName,
          });
          executionFees[i] = executionFees[i].plus(outputEstimate.extraData?.executionFee ?? INTEGERS.ZERO);
        }),
      );
    } else {
      marketIdsPaths.forEach(marketIdsPath => {
        if (!marketIdsPath[marketIdsPath.length - 1].eq(outputMarket.marketId)) {
          marketIdsPath.push(outputMarket.marketId);
        }
      });
    }

    const tokensPaths = marketIdsPaths.map<ApiToken[]>(marketIdsPath => {
      return marketIdsPath.map(marketId => ({
        marketId,
        symbol: marketsMap[marketId.toFixed()].symbol,
        name: marketsMap[marketId.toFixed()].name,
        tokenAddress: marketsMap[marketId.toFixed()].tokenAddress,
        decimals: marketsMap[marketId.toFixed()].decimals,
      }));
    });

    // Unify the min amount out to be the same for UX's sake
    const expectedAmountOut = amountsPaths.reduce((max, currentPath) => {
      const current = currentPath[currentPath.length - 1];
      if (current.gt(max)) {
        return current;
      }

      return max;
    }, INTEGERS.ZERO);

    const minAmountOut = expectedAmountOut
      .multipliedBy(1 - actualConfig.slippageTolerance)
      .integerValue(BigNumber.ROUND_DOWN);

    const result = marketIdsPaths.map<ZapOutputParam>((_, i) => {
      if (!amountsPaths[i][amountsPaths[i].length - 1].eq(INVALID_ESTIMATION.amountOut)) {
        amountsPaths[i][amountsPaths[i].length - 1] = minAmountOut;
      }
      return {
        marketIdsPath: marketIdsPaths[i],
        tokensPath: tokensPaths[i],
        expectedAmountOut,
        amountWeisPath: amountsPaths[i],
        traderParams: traderParamsArrays[i],
        makerAccounts: [],
        originalAmountOutMin: amountOutMin,
        executionFee: executionFees[i].gt(INTEGERS.ZERO) ? executionFees[i] : undefined,
      };
    });

    const zaps = result.filter(p => !zapOutputParamIsInvalid(p));
    if (actualConfig.filterOutZapsWithInsufficientOutput) {
      return zaps.filter(zap => zap.expectedAmountOut.gte(amountOutMin));
    } else {
      return zaps;
    }
  }

  /**
   *
   * @param tokenIn The input token for the zap. Must be an async market.
   * @param amountIn The input amount for the zap. This should be held amount of collateral seized for liquidation
   * @param tokenOut The output token for the zap. Must not be an async market.
   * @param amountOutMin The minimum amount out required for the swap to be considered valid
   * @param txOrigin The address that will execute the transaction
   * @param marketIdToActionsMap A mapping from output market to a list of async deposits/withdrawals that output a
   *                             valid output token from `tokenIn`
   * @param marketIdToOracleMap A mapping from market ID to the corresponding market's oracle price
   * @param config The additional config for zapping
   * @return {Promise<ZapOutputParam[]>} A list of outputs that can be used to execute the trade. The outputs are
   * sorted by execution, with the best ones being first.
   */
  public async getSwapExactAsyncTokensForTokensParamsForLiquidation(
    tokenIn: ApiToken | MinimalApiToken,
    amountIn: Integer,
    tokenOut: ApiToken | MinimalApiToken,
    amountOutMin: Integer,
    txOrigin: Address,
    marketIdToActionsMap: Record<string, ApiAsyncAction[]>,
    marketIdToOracleMap: Record<string, ApiOraclePrice>,
    config?: Partial<ZapConfig>,
  ): Promise<ZapOutputParam[]> {
    if (typeof config?.isLiquidation === 'undefined' || !config.isLiquidation) {
      return Promise.reject(new Error('Config must include `isLiquidation=true`'));
    }

    const marketsMap = await this.getMarketIdToMarketMap(false);
    const allActions = Object.values(marketIdToActionsMap);
    if (!this.getIsAsyncAssetByMarketId(tokenIn.marketId)) {
      return Promise.reject(new Error('tokenIn must be an async asset!'));
    } else if (this.getIsAsyncAssetByMarketId(tokenOut.marketId)) {
      return Promise.reject(new Error('tokenOut must not be an async asset!'));
    } else if (allActions.length === 0 || allActions.every(a => a.length === 0)) {
      return Promise.reject(new Error('marketIdToActionsMap must not be empty'));
    }

    const outputWeiFromActionsWithMarket = Object.keys(marketIdToActionsMap).reduce(
      (acc, outputMarketId) => {
        const actions = marketIdToActionsMap[outputMarketId];
        const oraclePriceUsd = marketIdToOracleMap[outputMarketId]?.oraclePrice;
        if (!oraclePriceUsd) {
          throw new Error(`Oracle price for ${outputMarketId} could not be found!`);
        }

        const outputValue = actions.reduce(
          (sum, action) => {
            if (sum.inputValue.gt(INTEGERS.ZERO)) {
              if (action.inputToken.marketId.eq(tokenIn.marketId)) {
                const usedInputAmount = sum.inputValue.lt(action.inputAmount)
                  ? sum.inputValue
                  : action.inputAmount;
                const usedOutputAmount = sum.inputValue.lt(action.inputAmount)
                  ? action.outputAmount.times(sum.inputValue).dividedToIntegerBy(action.inputAmount)
                  : action.outputAmount;

                sum.inputValue = sum.inputValue.minus(usedInputAmount);
                sum.outputValue = sum.outputValue.plus(usedOutputAmount);
                sum.outputValueUsd = sum.outputValueUsd.plus(usedOutputAmount.times(oraclePriceUsd));
              } else if (action.outputToken.marketId.eq(tokenIn.marketId)) {
                const usedInputAmount = sum.inputValue.lt(action.outputAmount)
                  ? sum.inputValue
                  : action.outputAmount;
                const usedOutputAmount = sum.inputValue.lt(action.outputAmount)
                  ? action.inputAmount.times(sum.inputValue).dividedToIntegerBy(action.outputAmount)
                  : action.inputAmount;

                sum.inputValue = sum.inputValue.minus(usedInputAmount);
                sum.outputValue = sum.outputValue.plus(usedOutputAmount);
                sum.outputValueUsd = sum.outputValueUsd.plus(usedOutputAmount.times(oraclePriceUsd));
              }
            }
            return sum;
          },
          {
            inputValue: amountIn,
            outputValue: INTEGERS.ZERO,
            outputValueUsd: INTEGERS.ZERO,
            outputMarket: marketsMap[outputMarketId],
          },
        );

        if (acc.outputValueUsd.gt(outputValue.outputValueUsd)) {
          return acc;
        } else {
          return outputValue;
        }
      },
      {
        outputValue: INTEGERS.ZERO,
        outputValueUsd: INTEGERS.ZERO,
        outputMarket: marketsMap[Object.keys(marketIdToActionsMap)[0]],
      },
    );

    const outputToken: MinimalApiToken = {
      marketId: new BigNumber(outputWeiFromActionsWithMarket.outputMarket.marketId.toFixed()),
      symbol: outputWeiFromActionsWithMarket.outputMarket.symbol,
    };

    const actions = marketIdToActionsMap[outputToken.marketId.toFixed()];

    let outputs: ZapOutputParam[];
    if (outputToken.marketId.eq(tokenOut.marketId)) {
      const minAmountOut = outputWeiFromActionsWithMarket.outputValue
        .multipliedBy(1 - (config.slippageTolerance ?? this.defaultSlippageTolerance))
        .integerValue(BigNumber.ROUND_DOWN);
      outputs = [{
        marketIdsPath: [tokenIn.marketId, tokenOut.marketId],
        tokensPath: [marketsMap[tokenIn.marketId.toFixed()], marketsMap[tokenOut.marketId.toFixed()]],
        amountWeisPath: [amountIn, minAmountOut],
        traderParams: [this.getAsyncUnwrapperTraderParam(tokenIn, actions, config)],
        makerAccounts: [],
        expectedAmountOut: outputWeiFromActionsWithMarket.outputValue,
        originalAmountOutMin: outputWeiFromActionsWithMarket.outputValue,
      }];
    } else {
      outputs = await this.getSwapExactTokensForTokensParams(
        outputToken,
        outputWeiFromActionsWithMarket.outputValue,
        tokenOut,
        amountOutMin,
        txOrigin,
        config,
      );
      outputs.forEach(output => {
        output.marketIdsPath = [
          new BigNumber(tokenIn.marketId.toFixed()),
          ...output.marketIdsPath,
        ];
        output.amountWeisPath = [
          amountIn,
          ...output.amountWeisPath,
        ];

        output.traderParams = [
          this.getAsyncUnwrapperTraderParam(tokenIn, actions, config),
          ...output.traderParams,
        ];
      });
    }

    return outputs;
  }

  private getAsyncUnwrapperTraderParam(
    asyncToken: MinimalApiToken,
    actions: ApiAsyncAction[],
    config: Partial<ZapConfig>,
  ): GenericTraderParam {
    const converter = this.getIsolationModeConverterByMarketId(asyncToken.marketId)!;
    return {
      traderType: GenericTraderType.IsolationModeUnwrapper,
      tradeData: ethers.utils.defaultAbiCoder.encode(
        ['uint8[]', 'bytes32[]', 'bool'],
        [
          actions.map(a => (a.actionType === ApiAsyncActionType.WITHDRAWAL
            ? ApiAsyncTradeType.FromWithdrawal
            : ApiAsyncTradeType.FromDeposit)),
          actions.map(a => a.key),
          !config.isVaporizable,
        ],
      ),
      readableName: converter.unwrapperReadableName,
      trader: converter.unwrapper,
      makerAccountIndex: 0,
    }
  }

  protected getAllAggregators(
    network: Network,
    referralInfo: ReferralOutput,
    useProxyServer: boolean,
  ): AggregatorClient[] {
    const odosAggregator = new OdosAggregator(network, referralInfo.odosReferralCode, useProxyServer);
    const paraswapAggregator = new ParaswapAggregator(network, referralInfo.referralAddress, useProxyServer);
    return [odosAggregator, paraswapAggregator];
  }

  protected async getMarketIdToMarketMap(forceRefresh: boolean): Promise<Record<string, ApiMarket>> {
    if (!forceRefresh) {
      const cachedMarkets = this.marketsCache.get(marketsKey);
      if (cachedMarkets) {
        return cachedMarkets;
      }
    }

    const marketsMap = await this.client.getDolomiteMarketsMap();
    this.marketsCache.set(marketsKey, marketsMap);
    return marketsMap;
  }

  private async getMarketHelpersMap(
    marketsMap: Record<string, ApiMarket>,
  ): Promise<Record<string, ApiMarketHelper>> {
    const cachedMarkets = this.marketHelpersCache.get(marketHelpersKey);
    if (cachedMarkets) {
      return cachedMarkets;
    }

    const marketHelpersMap = await this.client.getDolomiteMarketHelpers(marketsMap);
    this.marketHelpersCache.set(marketHelpersKey, marketHelpersMap);
    return marketHelpersMap;
  }
}
