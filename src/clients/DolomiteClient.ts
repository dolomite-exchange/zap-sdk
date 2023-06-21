import axios from 'axios';
import { ethers } from 'ethers';
import {
  ApiMarket,
  ApiMarketHelper,
  ApiUnwrapperInfo,
  ApiWrapperInfo,
  BlockTag,
  MarketId,
  Network,
} from '../lib/ApiTypes';
import { StandardEstimator } from '../lib/estimators/StandardEstimator';
import { GraphqlMarketResult } from '../lib/graphql-types';
import GraphqlPageable from '../lib/GraphqlPageable';
import Logger from '../lib/Logger';
import IsolationModeClient from './IsolationModeClient';

const defaultAxiosConfig = {
  headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
};

export default class DolomiteClient {
  private readonly subgraphUrl: string;
  private readonly networkId: Network;
  private readonly web3Provider: ethers.providers.Provider;

  public constructor(
    subgraphUrl: string,
    networkId: Network,
    web3Provider: ethers.providers.Provider,
  ) {
    this.subgraphUrl = subgraphUrl;
    this.networkId = networkId;
    this.web3Provider = web3Provider;
  }

  public async getDolomiteMarketsMap(
    blockTag: BlockTag = 'latest',
  ): Promise<Record<MarketId, ApiMarket>> {
    const marketsList = await GraphqlPageable.getPageableValues((pageIndex) => this.getDolomiteMarketsWithPaging(
      blockTag,
      pageIndex,
    ));
    return marketsList.reduce<Record<MarketId, ApiMarket>>((acc, market) => {
      acc[market.marketId] = market;
      return acc;
    }, {});
  }

  public async getDolomiteMarketHelpers(
    marketsMap: Record<MarketId, ApiMarket>,
  ): Promise<Record<MarketId, ApiMarketHelper>> {
    const standardEstimator = new StandardEstimator(this.web3Provider, marketsMap);
    return Object.values(marketsMap).reduce<Record<MarketId, ApiMarketHelper>>((acc, market) => {
      const marketHelper: ApiMarketHelper = {
        marketId: market.marketId,
        isolationModeUnwrapperHelper: undefined,
        liquidityTokenUnwrapperHelper: undefined,
        isolationModeWrapperHelper: undefined,
        liquidityTokenWrapperHelper: undefined,
      }

      const isolationModeUnwrapper = market.isolationModeUnwrapperInfo;
      if (isolationModeUnwrapper) {
        marketHelper.isolationModeUnwrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            outputMarketId,
          ) => standardEstimator.getUnwrappedAmount(
            market.tokenAddress,
            isolationModeUnwrapper.unwrapperAddress,
            amountIn,
            outputMarketId,
          ),
        }
      }
      const liquidityTokenUnwrapper = market.liquidityTokenUnwrapperInfo;
      if (liquidityTokenUnwrapper) {
        marketHelper.liquidityTokenUnwrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            outputMarketId,
          ) => standardEstimator.getUnwrappedAmount(
            market.tokenAddress,
            liquidityTokenUnwrapper.unwrapperAddress,
            amountIn,
            outputMarketId,
          ),
        }
      }
      const isolationModeWrapper = market.isolationModeWrapperInfo;
      if (isolationModeWrapper) {
        marketHelper.isolationModeWrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            inputMarketId,
          ) => standardEstimator.getWrappedAmount(
            market.tokenAddress,
            isolationModeWrapper.wrapperAddress,
            amountIn,
            inputMarketId,
          ),
        }
      }
      const liquidityTokenWrapper = market.liquidityTokenWrapperInfo;
      if (liquidityTokenWrapper) {
        marketHelper.liquidityTokenWrapperHelper = {
          estimateOutputFunction: async (
            amountIn,
            inputMarketId,
          ) => standardEstimator.getWrappedAmount(
            market.tokenAddress,
            liquidityTokenWrapper.wrapperAddress,
            amountIn,
            inputMarketId,
          ),
        }
      }

      acc[market.marketId] = marketHelper;
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
              }`
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

    const markets: Promise<ApiMarket | undefined>[] = result.data.marketRiskInfos.map(async (market) => {
      const isolationModeClient = new IsolationModeClient(this.networkId);
      let isolationModeUnwrapperInfo: ApiUnwrapperInfo | undefined;
      let isolationModeWrapperInfo: ApiWrapperInfo | undefined;
      if (isolationModeClient.isIsolationModeToken(market.token)) {
        const unwrapperAddress = isolationModeClient.getIsolationModeUnwrapperByMarketId(market.token);
        const outputMarketId = isolationModeClient.getIsolationModeUnwrapperMarketIdByMarketId(market.token);
        const wrapperAddress = isolationModeClient.getIsolationModeWrapperByMarketId(market.token);
        const inputMarketId = isolationModeClient.getIsolationModeWrapperMarketIdByMarketId(market.token);

        if (!unwrapperAddress || typeof outputMarketId === 'undefined') {
          Logger.warn({
            message: 'Isolation Mode token cannot find unwrapper info!',
            marketId: market.token.marketId,
          });
          return undefined;
        } else if (!wrapperAddress || typeof inputMarketId === 'undefined') {
          Logger.warn({
            message: 'Isolation Mode token cannot find wrapper info!',
            marketId: market.token.marketId,
          });
          return undefined;
        }

        isolationModeUnwrapperInfo = { unwrapperAddress, outputMarketId };
        isolationModeWrapperInfo = { wrapperAddress, inputMarketId };
      }

      let liquidityTokenUnwrapperInfo: ApiUnwrapperInfo | undefined;
      let liquidityTokenWrapperInfo: ApiWrapperInfo | undefined;
      if (isolationModeClient.isLiquidityToken(market.token)) {
        liquidityTokenUnwrapperInfo = {
          unwrapperAddress: isolationModeClient.getLiquidityTokenUnwrapperByToken(market.token),
          outputMarketId: isolationModeClient.getLiquidityTokenUnwrapperMarketIdByToken(market.token),
        };
        liquidityTokenWrapperInfo = {
          wrapperAddress: isolationModeClient.getLiquidityTokenWrapperByToken(market.token),
          inputMarketId: isolationModeClient.getLiquidityTokenWrapperMarketIdByToken(market.token),
        };
      }

      const apiMarket: ApiMarket = {
        marketId: Number(market.token.marketId),
        symbol: market.token.symbol,
        name: market.token.name,
        tokenAddress: ethers.utils.getAddress(market.token.id),
        decimals: Number(market.token.decimals),
        isolationModeUnwrapperInfo,
        isolationModeWrapperInfo,
        liquidityTokenUnwrapperInfo,
        liquidityTokenWrapperInfo,
      };
      return apiMarket;
    });

    return (await Promise.all(markets)).filter(market => !!market) as ApiMarket[];
  }
}
