import BigNumber from 'bignumber.js';

export type Integer = BigNumber;
export type Address = string;
export type MarketId = BigNumber;

export enum Network {
  ARBITRUM_ONE = 42161,
  BASE = 8453,
  BERACHAIN = 80094,
  MANTLE = 5000,
  POLYGON_ZKEVM = 1101,
  X_LAYER = 196,
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
  outputMarketIds: MarketId[];
  readableName: string;
}

export interface ApiWrapperInfo {
  wrapperAddress: Address;
  inputMarketIds: MarketId[];
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
  extraData?: {
    executionFee: Integer;
  };
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

// noinspection JSUnusedGlobalSymbols
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
  oogaBoogaApiKey: string | undefined;
  odosReferralCode: Integer | undefined;
}

export interface ZapConfig {
  isLiquidation: boolean;
  isVaporizable: boolean;
  slippageTolerance: number;
  blockTag: BlockTag;
  filterOutZapsWithInsufficientOutput: boolean;
  subAccountNumber: Integer | undefined;
  gasPriceInWei: Integer | undefined;
  disallowAggregator: boolean;
  additionalMakerAccounts: AccountInfo[] | undefined
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
  /**
   * The `msg.value` to pass along to the transaction for paying for gas fees. Usually this is (slightly)
   * over-estimated.
   */
  executionFee?: Integer;
}

export interface ApiOraclePrice {
  /**
   * The oracle price of a corresponding asset. Formatted as a number with `36 - decimals`.
   */
  oraclePrice: Integer;
}

export interface ApiAsyncAction {
  id: string;
  key: string;
  actionType: ApiAsyncActionType;
  owner: string;
  accountNumber: BigNumber;
  status: ApiAsyncDepositStatus | ApiAsyncWithdrawalStatus;
  inputToken: ApiToken;
  inputAmount: Integer;
  outputToken: ApiToken;
  outputAmount: Integer;
}

export enum ApiAsyncActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

// noinspection JSUnusedGlobalSymbols
export interface ApiAsyncDeposit extends ApiAsyncAction {
  actionType: ApiAsyncActionType.DEPOSIT;
  status: ApiAsyncDepositStatus;
}

// noinspection JSUnusedGlobalSymbols
export enum ApiAsyncDepositStatus {
  CREATED = 'CREATED',
  DEPOSIT_EXECUTED = 'DEPOSIT_EXECUTED',
  DEPOSIT_FAILED = 'DEPOSIT_FAILED',
  DEPOSIT_CANCELLED = 'DEPOSIT_CANCELLED',
  DEPOSIT_CANCELLED_FAILED = 'DEPOSIT_CANCELLED_FAILED',
}

// noinspection JSUnusedGlobalSymbols
export enum ApiAsyncTradeType {
  FromWithdrawal = 0,
  FromDeposit = 1,
  NoOp = 2,
}

// noinspection JSUnusedGlobalSymbols
export enum ApiAsyncWithdrawalStatus {
  CREATED = 'CREATED',
  WITHDRAWAL_EXECUTED = 'WITHDRAWAL_EXECUTED',
  WITHDRAWAL_EXECUTION_FAILED = 'WITHDRAWAL_EXECUTION_FAILED',
  WITHDRAWAL_CANCELLED = 'WITHDRAWAL_CANCELLED',
}

// noinspection JSUnusedGlobalSymbols
export interface ApiAsyncWithdrawal extends ApiAsyncAction {
  actionType: ApiAsyncActionType.WITHDRAWAL;
  status: ApiAsyncWithdrawalStatus;
}

export interface ApiMarketConverter {
  tokenAddress: Address;
  unwrapper: Address;
  unwrapperForLiquidation?: Address;
  wrapper: Address;
  unwrapperMarketIds: MarketId[];
  wrapperMarketIds: MarketId[];
  unwrapperReadableName: string;
  wrapperReadableName: string;
  isAsync: boolean;
}

export interface GlvMarket {
  glvTokenAddress: Address;
  longTokenAddress: Address;
  longTokenId: MarketId;
  shortTokenAddress: Address;
  shortTokenId: MarketId;
}

export interface GmMarket {
  indexTokenAddress: string;
  shortTokenAddress: string;
  longTokenAddress: string;
  marketTokenAddress: Address;
}

export interface GmMarketWithMarketId extends GmMarket {
  shortTokenId: MarketId | undefined;
  longTokenId: MarketId | undefined;
}

export interface PendleMarketProps {
  marketTokenAddress: string;
  transformerTokenAddress: string;
  ytTokenAddress: string;
  maturityTimestamp: number;
}

export interface POLMarketProps {
  marketId: MarketId;
  dTokenAddress: string;
}
