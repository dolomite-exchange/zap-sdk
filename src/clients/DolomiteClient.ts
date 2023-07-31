import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ApiMarket, ApiMarketHelper, ApiUnwrapperInfo, ApiWrapperInfo, BlockTag, Network } from '../lib/ApiTypes';
import { StandardEstimator } from '../lib/estimators/StandardEstimator';
import { GraphqlMarketResult } from '../lib/graphql-types';
import GraphqlPageable from '../lib/GraphqlPageable';
import Logger from '../lib/Logger';
import { toChecksumOpt } from '../lib/Utils';
import IsolationModeClient from './IsolationModeClient';

const defaultAxiosConfig = {
  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
};

export default class DolomiteClient {
  private readonly subgraphUrl: string;
  private readonly network: Network;
  private readonly web3Provider: ethers.providers.Provider;
  private marketsToAdd: ApiMarket[];

  public constructor(
    subgraphUrl: string,
    networkId: Network,
    web3Provider: ethers.providers.Provider,
  ) {
    this.subgraphUrl = subgraphUrl;
    this.network = networkId;
    this.web3Provider = web3Provider;
    this.marketsToAdd = [];
  }

  public setMarketsToAdd(
    marketsToAdd: ApiMarket[],
  ): void {
    for (let i = 0; i < marketsToAdd.length; i += 1) {
      if (marketsToAdd[i].name.includes('Dolomite Isolation:')) {
        if (!marketsToAdd[i].isolationModeUnwrapperInfo || !marketsToAdd[i].isolationModeWrapperInfo) {
          throw new Error(`Missing isolation mode data for market ${marketsToAdd[i].marketId}`);
        }
      }
    }
    this.marketsToAdd = marketsToAdd;
  }

  public async getDolomiteMarketsMap(
    blockTag: BlockTag = 'latest',
  ): Promise<Record<string, ApiMarket>> {
    const marketsList = await GraphqlPageable.getPageableValues((pageIndex) => this.getDolomiteMarketsWithPaging(
      blockTag,
      pageIndex,
    ));
    return (marketsList.concat(...this.marketsToAdd)).reduce<Record<string, ApiMarket>>((acc, market) => {
      acc[market.marketId.toFixed()] = market;
      return acc;
    }, {});
  }

  public async getDolomiteMarketHelpers(
    marketsMap: Record<string, ApiMarket>,
  ): Promise<Record<string, ApiMarketHelper>> {
    const standardEstimator = new StandardEstimator(this.network, this.web3Provider, marketsMap);
    return Object.values(marketsMap).reduce<Record<string, ApiMarketHelper>>((acc, market) => {
      const marketHelper: ApiMarketHelper = {
        marketId: market.marketId,
        isolationModeUnwrapperHelper: undefined,
        liquidityTokenUnwrapperHelper: undefined,
        isolationModeWrapperHelper: undefined,
        liquidityTokenWrapperHelper: undefined,
      };

      const isolationModeUnwrapper = market.isolationModeUnwrapperInfo;
      if (isolationModeUnwrapper) {
        const unwrapperForLiquidationAddress = isolationModeUnwrapper.unwrapperForLiquidationAddress
          ?? isolationModeUnwrapper.unwrapperAddress;
        marketHelper.isolationModeUnwrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            outputMarketId,
            config,
          ) => standardEstimator.getUnwrappedAmount(
            market.tokenAddress,
            config.isLiquidation ? unwrapperForLiquidationAddress : isolationModeUnwrapper.unwrapperAddress,
            amountIn,
            outputMarketId,
            config,
          ),
        };
      }
      const liquidityTokenUnwrapper = market.liquidityTokenUnwrapperInfo;
      if (liquidityTokenUnwrapper) {
        const unwrapperForLiquidationAddress = liquidityTokenUnwrapper.unwrapperForLiquidationAddress
          ?? liquidityTokenUnwrapper.unwrapperAddress;
        marketHelper.liquidityTokenUnwrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            outputMarketId,
            config,
          ) => standardEstimator.getUnwrappedAmount(
            market.tokenAddress,
            config.isLiquidation ? unwrapperForLiquidationAddress : liquidityTokenUnwrapper.unwrapperAddress,
            amountIn,
            outputMarketId,
            config,
          ),
        };
      }
      const isolationModeWrapper = market.isolationModeWrapperInfo;
      if (isolationModeWrapper) {
        marketHelper.isolationModeWrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            inputMarketId,
            config,
          ) => standardEstimator.getWrappedAmount(
            market.tokenAddress,
            isolationModeWrapper.wrapperAddress,
            amountIn,
            inputMarketId,
            config,
          ),
        };
      }
      const liquidityTokenWrapper = market.liquidityTokenWrapperInfo;
      if (liquidityTokenWrapper) {
        marketHelper.liquidityTokenWrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            inputMarketId,
            config,
          ) => standardEstimator.getWrappedAmount(
            market.tokenAddress,
            liquidityTokenWrapper.wrapperAddress,
            amountIn,
            inputMarketId,
            config,
          ),
        };
      }

      acc[market.marketId.toFixed()] = marketHelper;
      return acc;
    }, {});
  }

  private async getDolomiteMarketsWithPaging(
    blockTag: BlockTag = 'latest',
    pageIndex: number = 0,
  ): Promise<ApiMarket[]> {
    let query: string;
    if (blockTag === 'latest') {
      // omit the time travel predicate
      query = `query getMarketRiskInfos($skip: Int) {
                marketRiskInfos(first: ${GraphqlPageable.MAX_PAGE_SIZE} skip: $skip) {
                  id
                  token {
                    id
                    marketId
                    name
                    symbol
                    decimals
                  }
                }
              }`;
    } else {
      query = `query getMarketRiskInfos($blockNumber: Int, $skip: Int) {
                marketRiskInfos(block: { number: $blockNumber } first: ${GraphqlPageable.MAX_PAGE_SIZE} skip: $skip) {
                  id
                  token {
                    id
                    marketId
                    name
                    symbol
                    decimals
                  }
                }
              }`;
    }
    const result: GraphqlMarketResult = await axios.post(
      this.subgraphUrl,
      {
        query,
        variables: {
          blockNumber: blockTag === 'latest' ? undefined : blockTag,
          skip: pageIndex * GraphqlPageable.MAX_PAGE_SIZE,
        },
      },
      defaultAxiosConfig,
    )
      .then(response => response.data)
      .then(json => json as GraphqlMarketResult);

    if (result.errors && typeof result.errors === 'object') {
      // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
      return Promise.reject(result.errors[0]);
    }

    const marketPromises: Promise<ApiMarket | undefined>[] = result.data.marketRiskInfos.map(async (market) => {
      const isolationModeClient = new IsolationModeClient(this.network);
      let isolationModeUnwrapperInfo: ApiUnwrapperInfo | undefined;
      let isolationModeWrapperInfo: ApiWrapperInfo | undefined;
      if (isolationModeClient.isIsolationModeToken(market.token)) {
        const unwrapperAddress = isolationModeClient.getIsolationModeUnwrapperByMarketId(market.token);
        const unwrapperForLiquidationAddress = isolationModeClient.getIsolationModeUnwrapperForLiquidationByMarketId(
          market.token,
        );
        const outputMarketId = isolationModeClient.getIsolationModeUnwrapperMarketIdByMarketId(market.token);
        const wrapperAddress = isolationModeClient.getIsolationModeWrapperByMarketId(market.token);
        const inputMarketId = isolationModeClient.getIsolationModeWrapperMarketIdByMarketId(market.token);
        const unwrapperReadableName = isolationModeClient.getIsolationModeUnwrapperReadableNameByMarketId(market.token);
        const wrapperReadableName = isolationModeClient.getIsolationModeWrapperReadableNameByMarketId(market.token);

        if (!unwrapperAddress || typeof outputMarketId === 'undefined' || !unwrapperReadableName) {
          Logger.warn({
            message: 'Isolation Mode token cannot find unwrapper info!',
            marketId: market.token.marketId,
          });
          return undefined;
        } else if (!wrapperAddress || typeof inputMarketId === 'undefined' || !wrapperReadableName) {
          Logger.warn({
            message: 'Isolation Mode token cannot find wrapper info!',
            marketId: market.token.marketId,
          });
          return undefined;
        }

        isolationModeUnwrapperInfo = {
          unwrapperAddress,
          unwrapperForLiquidationAddress,
          outputMarketId,
          readableName: unwrapperReadableName,
        };
        isolationModeWrapperInfo = {
          wrapperAddress,
          inputMarketId,
          readableName: wrapperReadableName,
        };
      }

      let liquidityTokenUnwrapperInfo: ApiUnwrapperInfo | undefined;
      let liquidityTokenWrapperInfo: ApiWrapperInfo | undefined;
      if (isolationModeClient.isLiquidityToken(market.token)) {
        liquidityTokenUnwrapperInfo = {
          unwrapperAddress: isolationModeClient.getLiquidityTokenUnwrapperByToken(market.token),
          outputMarketId: isolationModeClient.getLiquidityTokenUnwrapperMarketIdByToken(market.token),
          readableName: isolationModeClient.getLiquidityTokenUnwrapperReadableNameByToken(market.token),
        };
        liquidityTokenWrapperInfo = {
          wrapperAddress: isolationModeClient.getLiquidityTokenWrapperByToken(market.token),
          inputMarketId: isolationModeClient.getLiquidityTokenWrapperMarketIdByToken(market.token),
          readableName: isolationModeClient.getLiquidityTokenWrapperReadableNameByToken(market.token),
        };
      }

      const apiMarket: ApiMarket = {
        marketId: new BigNumber(market.token.marketId),
        symbol: market.token.symbol,
        name: market.token.name,
        tokenAddress: toChecksumOpt(market.token.id)!,
        decimals: Number(market.token.decimals),
        isolationModeUnwrapperInfo,
        isolationModeWrapperInfo,
        liquidityTokenUnwrapperInfo,
        liquidityTokenWrapperInfo,
      };
      return apiMarket;
    });

    return (await Promise.all(marketPromises)).filter(market => !!market) as ApiMarket[];
  }
}
