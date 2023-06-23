import BigNumber from 'bignumber.js';

export type Integer = BigNumber;
export type Address = string;
export type MarketId = number;

export enum Network {
  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421611,
}

export type BlockTag = 'latest' | number;

export interface AccountInfo {
  owner: string;
  number: number | string;
}

export interface ApiToken {
  marketId: MarketId;
  symbol: string;
  name: string;
  tokenAddress: Address;
  decimals: number;
}

export interface ApiMarket {
  marketId: MarketId;
  symbol: string;
  name: string;
  tokenAddress: Address;
  decimals: number;
  isolationModeUnwrapperInfo: ApiUnwrapperInfo | undefined;
  liquidityTokenUnwrapperInfo: ApiUnwrapperInfo | undefined;
  isolationModeWrapperInfo: ApiWrapperInfo | undefined;
  liquidityTokenWrapperInfo: ApiWrapperInfo | undefined;
}

export interface ApiUnwrapperInfo {
  unwrapperAddress: Address;
  outputMarketId: number;
}

export interface ApiWrapperInfo {
  wrapperAddress: Address;
  inputMarketId: number;
}

export interface ApiMarketHelper {
  marketId: MarketId;
  isolationModeUnwrapperHelper: ApiUnwrapperHelper | undefined;
  liquidityTokenUnwrapperHelper: ApiUnwrapperHelper | undefined;
  isolationModeWrapperHelper: ApiWrapperHelper | undefined;
  liquidityTokenWrapperHelper: ApiWrapperHelper | undefined;
}

export interface EstimateOutputResult {
  amountOut: Integer;
  tradeData: string;
}

export interface ApiUnwrapperHelper {
  estimateOutputFunction: (
    amountIn: Integer,
    outputMarketId: number,
    config: ZapConfig,
  ) => Promise<EstimateOutputResult>;
}

export interface ApiWrapperHelper {
  estimateOutputFunction: (
    amountIn: Integer,
    inputMarketId: number,
    config: ZapConfig,
  ) => Promise<EstimateOutputResult>;
}

export enum GenericTraderType {
  ExternalLiquidity = 0,
  InternalLiquidity = 1,
  IsolationModeUnwrapper = 2,
  IsolationModeWrapper = 3,
}

export interface GenericTraderParam {
  /**
   * The type of trader this param is
   */
  traderType: GenericTraderType;
  /**
   * The index into makerAccounts to be used if this traderType is InternalLiquidity
   */
  makerAccountIndex: number;
  /**
   * The address of the Trader contract (for external or internal liquidity)
   */
  trader: Address;
  /**
   * @description Hexadecimal bytes that can be passed to the trader contract.
   */
  tradeData: string;
}

export interface MarketIndex {
  marketId: MarketId;
  borrow: Integer;
  supply: Integer;
}

export interface AggregatorOutput {
  traderAddress: Address;
  tradeData: string;
  expectedAmountOut: Integer;
}

export interface ZapConfig {
  slippageTolerance: number;
}

export interface ZapOutputParam {
  /**
   * The sequence of market IDs used to create the zap
   */
  marketIdsPath: number[];
  /**
   * The expected output amounts for each market in the path
   */
  amountWeisPath: Integer[];
  /**
   * The trader params used for making a generic trade
   */
  traderParams: GenericTraderParam[];
  /**
   * The maker accounts used for GenericTraderType.InternalLiquidity
   */
  makerAccounts: AccountInfo[];
  /**
   * The minimum output amount that was inputted into the Zap function. Not the same as
   * amountWeisPath[amountWeisPath.length - 1]
   */
  amountOutMin: Integer;
}
