export interface GraphqlMarketResult {
  data: {
    marketRiskInfos: GraphqlMarket[]
  }
  errors: any
}

export interface GraphqlToken {
  id: string
  decimals: string
  marketId: string
  name: string
  symbol: string
}

export interface GraphqlMarket {
  id: string
  token: GraphqlToken
}
