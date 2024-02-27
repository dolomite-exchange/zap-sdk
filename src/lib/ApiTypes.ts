import BigNumber from 'bignumber.js';

export type Integer = BigNumber;
export type Address = string;
export type MarketId = BigNumber;

export enum Network {
  POLYGON_ZKEVM = 1101,
  BASE = 8453,
  ARBITRUM_ONE = 42161,
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

export interface MinimalApiToken {
  marketId: MarketId;
  symbol: string;
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
  unwrapperForLiquidationAddress?: Address;
  outputMarketId: MarketId;
  readableName: string;
}

export interface ApiWrapperInfo {
  wrapperAddress: Address;
  inputMarketId: MarketId;
  readableName: string;
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
    outputMarketId: MarketId,
    config: ZapConfig,
  ) => Promise<EstimateOutputResult>;
}

export interface ApiWrapperHelper {
  estimateOutputFunction: (
    amountIn: Integer,
    inputMarketId: MarketId,
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
   * Hexadecimal bytes that can be passed to the trader contract.
   */
  tradeData: string;
  /**
   * A descriptor that can be used in the UI to describe what this trader is (IE "Paraswap", "GLP Isolation Mode
   * Unwrapper", etc.)
   */
  readableName: string;
}

export interface AggregatorOutput {
  traderAddress: Address;
  tradeData: string;
  expectedAmountOut: Integer;
  readableName: string;
}

export interface ReferralOutput {
  referralAddress: Address | undefined;
  odosReferralCode: Integer | undefined;
}

export interface ZapConfig {
  isLiquidation: boolean;
  slippageTolerance: number;
  blockTag: BlockTag;
  filterOutZapsWithInsufficientOutput: boolean;
  gasPriceInWei?: Integer;
}

export interface ZapOutputParam {
  /**
   * The sequence of market IDs used to create the zap
   */
  marketIdsPath: MarketId[];
  /**
   * The sequence of tokens used to create the zap
   */
  tokensPath: ApiToken[];
  /**
   * The expected output amounts for each market in the path, including slippage
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
   * The expected amount out, not including slippage
   */
  expectedAmountOut: Integer;
  /**
   * The minimum output amount that was inputted into the Zap function. This is not the same as
   * amountWeisPath[amountWeisPath.length - 1] (since the last amount is the `expected` amount out including slippage)
   */
  originalAmountOutMin: Integer;
}
