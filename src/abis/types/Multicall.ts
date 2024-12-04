/* Autogenerated file. Do not edit manually. */
import type { FunctionFragment, Result } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
/* tslint:disable */
/* eslint-disable */
import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from 'ethers';

export interface MulticallInterface extends utils.Interface {
  functions: {
    'aggregate((address,bytes)[])': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'aggregate',
  ): FunctionFragment;

  decodeFunctionResult(functionFragment: 'aggregate', data: BytesLike): Result;
}

export interface Multicall__CallStruct {
  target: string;
  callData: string;
}

export interface Multicall extends BaseContract {
  interface: MulticallInterface;
  functions: {
    aggregate(
      calls: Multicall__CallStruct[],
      overrides?: CallOverrides,
    ): Promise<[BigNumber, string[]] & { blockNumber: BigNumber; returnData: string[] }>;
  };
  callStatic: {
    aggregate(
      calls: Multicall__CallStruct[],
      overrides?: CallOverrides,
    ): Promise<[BigNumber, string[]] & { blockNumber: BigNumber; returnData: string[] }>;
  };
  estimateGas: {
    aggregate(
      calls: Multicall__CallStruct[],
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };
  populateTransaction: {
    aggregate(
      calls: Multicall__CallStruct[],
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };

  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  listeners(eventName?: string): Array<Listener>;

  removeAllListeners(eventName?: string): this;

  aggregate(
    calls: Multicall__CallStruct[],
    overrides?: CallOverrides,
  ): Promise<[BigNumber, string[]] & { blockNumber: BigNumber; returnData: string[] }>;
}
