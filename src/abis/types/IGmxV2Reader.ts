/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Provider } from "@ethersproject/providers";

export declare namespace GmxDeposit {
  export type AddressesStruct = {
    account: string;
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    market: string;
    initialLongToken: string;
    initialShortToken: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
  };

  export type AddressesStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string[],
    string[]
  ] & {
    account: string;
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    market: string;
    initialLongToken: string;
    initialShortToken: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
  };

  export type NumbersStruct = {
    initialLongTokenAmount: BigNumberish;
    initialShortTokenAmount: BigNumberish;
    minMarketTokens: BigNumberish;
    updatedAtBlock: BigNumberish;
    executionFee: BigNumberish;
    callbackGasLimit: BigNumberish;
  };

  export type NumbersStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    initialLongTokenAmount: BigNumber;
    initialShortTokenAmount: BigNumber;
    minMarketTokens: BigNumber;
    updatedAtBlock: BigNumber;
    executionFee: BigNumber;
    callbackGasLimit: BigNumber;
  };

  export type FlagsStruct = { shouldUnwrapNativeToken: boolean };

  export type FlagsStructOutput = [boolean] & {
    shouldUnwrapNativeToken: boolean;
  };

  export type DepositPropsStruct = {
    addresses: GmxDeposit.AddressesStruct;
    numbers: GmxDeposit.NumbersStruct;
    flags: GmxDeposit.FlagsStruct;
  };

  export type DepositPropsStructOutput = [
    GmxDeposit.AddressesStructOutput,
    GmxDeposit.NumbersStructOutput,
    GmxDeposit.FlagsStructOutput
  ] & {
    addresses: GmxDeposit.AddressesStructOutput;
    numbers: GmxDeposit.NumbersStructOutput;
    flags: GmxDeposit.FlagsStructOutput;
  };
}

export declare namespace GmxMarket {
  export type MarketPropsStruct = {
    marketToken: string;
    indexToken: string;
    longToken: string;
    shortToken: string;
  };

  export type MarketPropsStructOutput = [string, string, string, string] & {
    marketToken: string;
    indexToken: string;
    longToken: string;
    shortToken: string;
  };

  export type MarketPricesStruct = {
    indexTokenPrice: GmxPrice.PricePropsStruct;
    longTokenPrice: GmxPrice.PricePropsStruct;
    shortTokenPrice: GmxPrice.PricePropsStruct;
  };

  export type MarketPricesStructOutput = [
    GmxPrice.PricePropsStructOutput,
    GmxPrice.PricePropsStructOutput,
    GmxPrice.PricePropsStructOutput
  ] & {
    indexTokenPrice: GmxPrice.PricePropsStructOutput;
    longTokenPrice: GmxPrice.PricePropsStructOutput;
    shortTokenPrice: GmxPrice.PricePropsStructOutput;
  };
}

export declare namespace GmxPrice {
  export type PricePropsStruct = { min: BigNumberish; max: BigNumberish };

  export type PricePropsStructOutput = [BigNumber, BigNumber] & {
    min: BigNumber;
    max: BigNumber;
  };
}

export declare namespace GmxMarketPoolValueInfo {
  export type PoolValueInfoPropsStruct = {
    poolValue: BigNumberish;
    longPnl: BigNumberish;
    shortPnl: BigNumberish;
    netPnl: BigNumberish;
    longTokenAmount: BigNumberish;
    shortTokenAmount: BigNumberish;
    longTokenUsd: BigNumberish;
    shortTokenUsd: BigNumberish;
    totalBorrowingFees: BigNumberish;
    borrowingFeePoolFactor: BigNumberish;
    impactPoolAmount: BigNumberish;
  };

  export type PoolValueInfoPropsStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    poolValue: BigNumber;
    longPnl: BigNumber;
    shortPnl: BigNumber;
    netPnl: BigNumber;
    longTokenAmount: BigNumber;
    shortTokenAmount: BigNumber;
    longTokenUsd: BigNumber;
    shortTokenUsd: BigNumber;
    totalBorrowingFees: BigNumber;
    borrowingFeePoolFactor: BigNumber;
    impactPoolAmount: BigNumber;
  };
}

export declare namespace IGmxV2Reader {
  export type SwapFeesStruct = {
    feeReceiverAmount: BigNumberish;
    feeAmountForPool: BigNumberish;
    amountAfterFees: BigNumberish;
    uiFeeReceiver: string;
    uiFeeReceiverFactor: BigNumberish;
    uiFeeAmount: BigNumberish;
  };

  export type SwapFeesStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber
  ] & {
    feeReceiverAmount: BigNumber;
    feeAmountForPool: BigNumber;
    amountAfterFees: BigNumber;
    uiFeeReceiver: string;
    uiFeeReceiverFactor: BigNumber;
    uiFeeAmount: BigNumber;
  };
}

export declare namespace GmxWithdrawal {
  export type AddressesStruct = {
    account: string;
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    market: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
  };

  export type AddressesStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string[],
    string[]
  ] & {
    account: string;
    receiver: string;
    callbackContract: string;
    uiFeeReceiver: string;
    market: string;
    longTokenSwapPath: string[];
    shortTokenSwapPath: string[];
  };

  export type NumbersStruct = {
    marketTokenAmount: BigNumberish;
    minLongTokenAmount: BigNumberish;
    minShortTokenAmount: BigNumberish;
    updatedAtBlock: BigNumberish;
    executionFee: BigNumberish;
    callbackGasLimit: BigNumberish;
  };

  export type NumbersStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    marketTokenAmount: BigNumber;
    minLongTokenAmount: BigNumber;
    minShortTokenAmount: BigNumber;
    updatedAtBlock: BigNumber;
    executionFee: BigNumber;
    callbackGasLimit: BigNumber;
  };

  export type FlagsStruct = { shouldUnwrapNativeToken: boolean };

  export type FlagsStructOutput = [boolean] & {
    shouldUnwrapNativeToken: boolean;
  };

  export type WithdrawalPropsStruct = {
    addresses: GmxWithdrawal.AddressesStruct;
    numbers: GmxWithdrawal.NumbersStruct;
    flags: GmxWithdrawal.FlagsStruct;
  };

  export type WithdrawalPropsStructOutput = [
    GmxWithdrawal.AddressesStructOutput,
    GmxWithdrawal.NumbersStructOutput,
    GmxWithdrawal.FlagsStructOutput
  ] & {
    addresses: GmxWithdrawal.AddressesStructOutput;
    numbers: GmxWithdrawal.NumbersStructOutput;
    flags: GmxWithdrawal.FlagsStructOutput;
  };
}

export interface IGmxV2ReaderInterface extends utils.Interface {
  functions: {
    "getDeposit(address,bytes32)": FunctionFragment;
    "getDepositAmountOut(address,(address,address,address,address),((uint256,uint256),(uint256,uint256),(uint256,uint256)),uint256,uint256,address)": FunctionFragment;
    "getMarketTokenPrice(address,(address,address,address,address),(uint256,uint256),(uint256,uint256),(uint256,uint256),bytes32,bool)": FunctionFragment;
    "getPnlToPoolFactor(address,address,((uint256,uint256),(uint256,uint256),(uint256,uint256)),bool,bool)": FunctionFragment;
    "getSwapAmountOut(address,(address,address,address,address),((uint256,uint256),(uint256,uint256),(uint256,uint256)),address,uint256,address)": FunctionFragment;
    "getSwapPriceImpact(address,address,address,address,uint256,(uint256,uint256),(uint256,uint256))": FunctionFragment;
    "getWithdrawal(address,bytes32)": FunctionFragment;
    "getWithdrawalAmountOut(address,(address,address,address,address),((uint256,uint256),(uint256,uint256),(uint256,uint256)),uint256,address)": FunctionFragment;
  };
  events: {};

  getFunction(
    nameOrSignatureOrTopic:
      | "getDeposit"
      | "getDepositAmountOut"
      | "getMarketTokenPrice"
      | "getPnlToPoolFactor"
      | "getSwapAmountOut"
      | "getSwapPriceImpact"
      | "getWithdrawal"
      | "getWithdrawalAmountOut"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getDeposit",
    values: [string, BytesLike]
  ): string;

  encodeFunctionData(
    functionFragment: "getDepositAmountOut",
    values: [
      string,
      GmxMarket.MarketPropsStruct,
      GmxMarket.MarketPricesStruct,
      BigNumberish,
      BigNumberish,
      string
    ]
  ): string;

  encodeFunctionData(
    functionFragment: "getMarketTokenPrice",
    values: [
      string,
      GmxMarket.MarketPropsStruct,
      GmxPrice.PricePropsStruct,
      GmxPrice.PricePropsStruct,
      GmxPrice.PricePropsStruct,
      BytesLike,
      boolean
    ]
  ): string;

  encodeFunctionData(
    functionFragment: "getPnlToPoolFactor",
    values: [string, string, GmxMarket.MarketPricesStruct, boolean, boolean]
  ): string;

  encodeFunctionData(
    functionFragment: "getSwapAmountOut",
    values: [
      string,
      GmxMarket.MarketPropsStruct,
      GmxMarket.MarketPricesStruct,
      string,
      BigNumberish,
      string
    ]
  ): string;

  encodeFunctionData(
    functionFragment: "getSwapPriceImpact",
    values: [
      string,
      string,
      string,
      string,
      BigNumberish,
      GmxPrice.PricePropsStruct,
      GmxPrice.PricePropsStruct
    ]
  ): string;

  encodeFunctionData(
    functionFragment: "getWithdrawal",
    values: [string, BytesLike]
  ): string;

  encodeFunctionData(
    functionFragment: "getWithdrawalAmountOut",
    values: [
      string,
      GmxMarket.MarketPropsStruct,
      GmxMarket.MarketPricesStruct,
      BigNumberish,
      string
    ]
  ): string;

  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;

  decodeFunctionResult(
    functionFragment: "getDepositAmountOut",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getMarketTokenPrice",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getPnlToPoolFactor",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getSwapAmountOut",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getSwapPriceImpact",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getWithdrawal",
    data: BytesLike
  ): Result;

  decodeFunctionResult(
    functionFragment: "getWithdrawalAmountOut",
    data: BytesLike
  ): Result;
}

export interface IGmxV2Reader extends BaseContract {
  interface: IGmxV2ReaderInterface;
  functions: {
    getDeposit(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<[GmxDeposit.DepositPropsStructOutput]>;

    getDepositAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _longTokenAmount: BigNumberish,
      _shortTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getMarketTokenPrice(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _indexTokenPrice: GmxPrice.PricePropsStruct,
      _longTokenPrice: GmxPrice.PricePropsStruct,
      _shortTokenPrice: GmxPrice.PricePropsStruct,
      _pnlFactorType: BytesLike,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, GmxMarketPoolValueInfo.PoolValueInfoPropsStructOutput]
    >;

    getPnlToPoolFactor(
      _dataStore: string,
      _marketAddress: string,
      _prices: GmxMarket.MarketPricesStruct,
      _isLong: boolean,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getSwapAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _tokenIn: string,
      _amountIn: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, IGmxV2Reader.SwapFeesStructOutput] & {
      fees: IGmxV2Reader.SwapFeesStructOutput;
    }
    >;

    getSwapPriceImpact(
      _dataStore: string,
      _marketKey: string,
      _tokenIn: string,
      _tokenOut: string,
      _amountIn: BigNumberish,
      _tokenInPrice: GmxPrice.PricePropsStruct,
      _tokenOutPrice: GmxPrice.PricePropsStruct,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getWithdrawal(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<[GmxWithdrawal.WithdrawalPropsStructOutput]>;

    getWithdrawalAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _marketTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };
  callStatic: {
    getDeposit(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<GmxDeposit.DepositPropsStructOutput>;

    getDepositAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _longTokenAmount: BigNumberish,
      _shortTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarketTokenPrice(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _indexTokenPrice: GmxPrice.PricePropsStruct,
      _longTokenPrice: GmxPrice.PricePropsStruct,
      _shortTokenPrice: GmxPrice.PricePropsStruct,
      _pnlFactorType: BytesLike,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, GmxMarketPoolValueInfo.PoolValueInfoPropsStructOutput]
    >;

    getPnlToPoolFactor(
      _dataStore: string,
      _marketAddress: string,
      _prices: GmxMarket.MarketPricesStruct,
      _isLong: boolean,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSwapAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _tokenIn: string,
      _amountIn: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, IGmxV2Reader.SwapFeesStructOutput] & {
      fees: IGmxV2Reader.SwapFeesStructOutput;
    }
    >;

    getSwapPriceImpact(
      _dataStore: string,
      _marketKey: string,
      _tokenIn: string,
      _tokenOut: string,
      _amountIn: BigNumberish,
      _tokenInPrice: GmxPrice.PricePropsStruct,
      _tokenOutPrice: GmxPrice.PricePropsStruct,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getWithdrawal(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<GmxWithdrawal.WithdrawalPropsStructOutput>;

    getWithdrawalAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _marketTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;
  };
  filters: {};
  estimateGas: {
    getDeposit(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDepositAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _longTokenAmount: BigNumberish,
      _shortTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarketTokenPrice(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _indexTokenPrice: GmxPrice.PricePropsStruct,
      _longTokenPrice: GmxPrice.PricePropsStruct,
      _shortTokenPrice: GmxPrice.PricePropsStruct,
      _pnlFactorType: BytesLike,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPnlToPoolFactor(
      _dataStore: string,
      _marketAddress: string,
      _prices: GmxMarket.MarketPricesStruct,
      _isLong: boolean,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSwapAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _tokenIn: string,
      _amountIn: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSwapPriceImpact(
      _dataStore: string,
      _marketKey: string,
      _tokenIn: string,
      _tokenOut: string,
      _amountIn: BigNumberish,
      _tokenInPrice: GmxPrice.PricePropsStruct,
      _tokenOutPrice: GmxPrice.PricePropsStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawal(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawalAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _marketTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    getDeposit(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDepositAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _longTokenAmount: BigNumberish,
      _shortTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarketTokenPrice(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _indexTokenPrice: GmxPrice.PricePropsStruct,
      _longTokenPrice: GmxPrice.PricePropsStruct,
      _shortTokenPrice: GmxPrice.PricePropsStruct,
      _pnlFactorType: BytesLike,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPnlToPoolFactor(
      _dataStore: string,
      _marketAddress: string,
      _prices: GmxMarket.MarketPricesStruct,
      _isLong: boolean,
      _maximize: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSwapAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _tokenIn: string,
      _amountIn: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSwapPriceImpact(
      _dataStore: string,
      _marketKey: string,
      _tokenIn: string,
      _tokenOut: string,
      _amountIn: BigNumberish,
      _tokenInPrice: GmxPrice.PricePropsStruct,
      _tokenOutPrice: GmxPrice.PricePropsStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWithdrawal(
      _dataStore: string,
      _key: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWithdrawalAmountOut(
      _dataStore: string,
      _market: GmxMarket.MarketPropsStruct,
      _prices: GmxMarket.MarketPricesStruct,
      _marketTokenAmount: BigNumberish,
      _uiFeeReceiver: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };

  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  getDeposit(
    _dataStore: string,
    _key: BytesLike,
    overrides?: CallOverrides
  ): Promise<GmxDeposit.DepositPropsStructOutput>;

  getDepositAmountOut(
    _dataStore: string,
    _market: GmxMarket.MarketPropsStruct,
    _prices: GmxMarket.MarketPricesStruct,
    _longTokenAmount: BigNumberish,
    _shortTokenAmount: BigNumberish,
    _uiFeeReceiver: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getMarketTokenPrice(
    _dataStore: string,
    _market: GmxMarket.MarketPropsStruct,
    _indexTokenPrice: GmxPrice.PricePropsStruct,
    _longTokenPrice: GmxPrice.PricePropsStruct,
    _shortTokenPrice: GmxPrice.PricePropsStruct,
    _pnlFactorType: BytesLike,
    _maximize: boolean,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, GmxMarketPoolValueInfo.PoolValueInfoPropsStructOutput]
  >;

  getPnlToPoolFactor(
    _dataStore: string,
    _marketAddress: string,
    _prices: GmxMarket.MarketPricesStruct,
    _isLong: boolean,
    _maximize: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getSwapAmountOut(
    _dataStore: string,
    _market: GmxMarket.MarketPropsStruct,
    _prices: GmxMarket.MarketPricesStruct,
    _tokenIn: string,
    _amountIn: BigNumberish,
    _uiFeeReceiver: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, IGmxV2Reader.SwapFeesStructOutput] & {
    fees: IGmxV2Reader.SwapFeesStructOutput;
  }
  >;

  getSwapPriceImpact(
    _dataStore: string,
    _marketKey: string,
    _tokenIn: string,
    _tokenOut: string,
    _amountIn: BigNumberish,
    _tokenInPrice: GmxPrice.PricePropsStruct,
    _tokenOutPrice: GmxPrice.PricePropsStruct,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getWithdrawal(
    _dataStore: string,
    _key: BytesLike,
    overrides?: CallOverrides
  ): Promise<GmxWithdrawal.WithdrawalPropsStructOutput>;

  getWithdrawalAmountOut(
    _dataStore: string,
    _market: GmxMarket.MarketPropsStruct,
    _prices: GmxMarket.MarketPricesStruct,
    _marketTokenAmount: BigNumberish,
    _uiFeeReceiver: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;
}
