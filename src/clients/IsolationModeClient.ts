import { ApiToken, MarketId, Network } from '../lib/ApiTypes';
import { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP, LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP } from '../lib/Constants';
import { GraphqlToken } from '../lib/graphql-types';

export default class IsolationModeClient {
  public readonly network: Network;

  constructor(network: Network) {
    this.network = network;
  }

  // ==================== Isolation Mode Getters ====================

  public isIsolationModeToken(token: GraphqlToken | ApiToken): boolean {
    return token.name.includes('Dolomite Isolation:') || token.symbol === 'dfsGLP';
  }

  public getIsolationModeUnwrapperMarketIdByMarketId(token: GraphqlToken): MarketId | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.unwrapperMarketId;
  }

  public getIsolationModeWrapperMarketIdByMarketId(token: GraphqlToken): MarketId | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.wrapperMarketId;
  }

  public getIsolationModeUnwrapperByMarketId(token: GraphqlToken): string | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.unwrapper;
  }

  public getIsolationModeUnwrapperForLiquidationByMarketId(token: GraphqlToken): string | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.unwrapperForLiquidation;
  }

  public getIsolationModeWrapperByMarketId(token: GraphqlToken): string | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.wrapper;
  }

  public getIsolationModeUnwrapperReadableNameByMarketId(token: GraphqlToken): string | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.unwrapperReadableName;
  }

  public getIsolationModeWrapperReadableNameByMarketId(token: GraphqlToken): string | undefined {
    return ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[this.network][token.marketId]?.wrapperReadableName;
  }

  // ==================== Liquidity Token Getters ====================

  public isLiquidityToken(token: GraphqlToken): boolean {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId] !== undefined;
  }

  public getLiquidityTokenUnwrapperMarketIdByToken(token: GraphqlToken): MarketId {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].unwrapperMarketId;
  }

  public getLiquidityTokenWrapperMarketIdByToken(token: GraphqlToken): MarketId {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].wrapperMarketId;
  }

  public getLiquidityTokenUnwrapperByToken(token: GraphqlToken): string {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].unwrapper;
  }

  public getLiquidityTokenWrapperByToken(token: GraphqlToken): string {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].wrapper;
  }

  public getLiquidityTokenUnwrapperReadableNameByToken(token: GraphqlToken): string {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].unwrapperReadableName;
  }

  public getLiquidityTokenWrapperReadableNameByToken(token: GraphqlToken): string {
    return LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[this.network][token.marketId].wrapperReadableName;
  }
}
