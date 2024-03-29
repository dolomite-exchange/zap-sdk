/* Autogenerated file. Do not edit manually. */
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Provider } from '@ethersproject/providers';
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';

export interface IArbitrumGasInfoInterface extends utils.Interface {
  functions: {
    'getCurrentTxL1GasFees()': FunctionFragment;
    'getGasAccountingParams()': FunctionFragment;
    'getL1GasPriceEstimate()': FunctionFragment;
    'getPricesInArbGas()': FunctionFragment;
    'getPricesInArbGasWithAggregator(address)': FunctionFragment;
    'getPricesInWei()': FunctionFragment;
    'getPricesInWeiWithAggregator(address)': FunctionFragment;
    'setL1GasPriceEstimate(uint256)': FunctionFragment;
  };
  events: {};

  getFunction(
    nameOrSignatureOrTopic:
      | 'getCurrentTxL1GasFees'
      | 'getGasAccountingParams'
      | 'getL1GasPriceEstimate'
      | 'getPricesInArbGas'
      | 'getPricesInArbGasWithAggregator'
      | 'getPricesInWei'
      | 'getPricesInWeiWithAggregator'
      | 'setL1GasPriceEstimate',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'getCurrentTxL1GasFees',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getGasAccountingParams',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getL1GasPriceEstimate',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getPricesInArbGas',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getPricesInArbGasWithAggregator',
    values: [string],
  ): string;

  encodeFunctionData(
    functionFragment: 'getPricesInWei',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getPricesInWeiWithAggregator',
    values: [string],
  ): string;

  encodeFunctionData(
    functionFragment: 'setL1GasPriceEstimate',
    values: [BigNumberish],
  ): string;

  decodeFunctionResult(
    functionFragment: 'getCurrentTxL1GasFees',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getGasAccountingParams',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getL1GasPriceEstimate',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getPricesInArbGas',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getPricesInArbGasWithAggregator',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getPricesInWei',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getPricesInWeiWithAggregator',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'setL1GasPriceEstimate',
    data: BytesLike,
  ): Result;
}

export interface IArbitrumGasInfo extends BaseContract {
  interface: IArbitrumGasInfoInterface;
  functions: {
    getCurrentTxL1GasFees(overrides?: CallOverrides): Promise<[BigNumber]>;

    getGasAccountingParams(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getL1GasPriceEstimate(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPricesInArbGas(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getPricesInArbGasWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getPricesInWei(
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
    >;

    getPricesInWeiWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
    >;

    setL1GasPriceEstimate(
      priceInWei: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<ContractTransaction>;
  };
  callStatic: {
    getCurrentTxL1GasFees(overrides?: CallOverrides): Promise<BigNumber>;

    getGasAccountingParams(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getL1GasPriceEstimate(overrides?: CallOverrides): Promise<BigNumber>;

    getPricesInArbGas(
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getPricesInArbGasWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber, BigNumber, BigNumber]>;

    getPricesInWei(
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
    >;

    getPricesInWeiWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
    >;

    setL1GasPriceEstimate(
      priceInWei: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;
  };
  filters: {};
  estimateGas: {
    getCurrentTxL1GasFees(overrides?: CallOverrides): Promise<BigNumber>;

    getGasAccountingParams(overrides?: CallOverrides): Promise<BigNumber>;

    getL1GasPriceEstimate(overrides?: CallOverrides): Promise<BigNumber>;

    getPricesInArbGas(overrides?: CallOverrides): Promise<BigNumber>;

    getPricesInArbGasWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getPricesInWei(overrides?: CallOverrides): Promise<BigNumber>;

    getPricesInWeiWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    setL1GasPriceEstimate(
      priceInWei: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    getCurrentTxL1GasFees(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getGasAccountingParams(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getL1GasPriceEstimate(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPricesInArbGas(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPricesInArbGasWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getPricesInWei(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPricesInWeiWithAggregator(
      aggregator: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    setL1GasPriceEstimate(
      priceInWei: BigNumberish,
      overrides?: Overrides & { from?: string },
    ): Promise<PopulatedTransaction>;
  };

  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  getCurrentTxL1GasFees(overrides?: CallOverrides): Promise<BigNumber>;

  getGasAccountingParams(
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  getL1GasPriceEstimate(overrides?: CallOverrides): Promise<BigNumber>;

  getPricesInArbGas(
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  getPricesInArbGasWithAggregator(
    aggregator: string,
    overrides?: CallOverrides,
  ): Promise<[BigNumber, BigNumber, BigNumber]>;

  getPricesInWei(
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  >;

  getPricesInWeiWithAggregator(
    aggregator: string,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  >;

  setL1GasPriceEstimate(
    priceInWei: BigNumberish,
    overrides?: Overrides & { from?: string },
  ): Promise<ContractTransaction>;
}
