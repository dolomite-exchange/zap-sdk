import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils
} from 'ethers';
import { FunctionFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import { Result } from 'ethers/lib/utils';

export interface IDeltaPairInterface extends utils.Interface {
  functions: {
    'totalSupply()': FunctionFragment;
    'getReserves()': FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | 'totalSupply'
      | 'getReserves',
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'totalSupply',
    values?: undefined,
  ): string;

  encodeFunctionData(
    functionFragment: 'getReserves',
    values?: undefined,
  ): string;

  decodeFunctionResult(
    functionFragment: 'totalSupply',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'getReserves',
    data: BytesLike,
  ): Result;
}

export interface IDeltaPair extends BaseContract {
  interface: IDeltaPairInterface;
  functions: {
    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    getReserves(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
  };
  callStatic: {
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    getReserves(overrides?: CallOverrides): Promise<BigNumber[]>;
  };
  estimateGas: {
    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    getReserves(overrides?: CallOverrides): Promise<BigNumber>;
  };
  populateTransaction: {
    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getReserves(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };

  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  listeners(eventName?: string): Array<Listener>;

  removeAllListeners(eventName?: string): this;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  getReserves(overrides?: CallOverrides): Promise<[BigNumber, BigNumber]>;
}