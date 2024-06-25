import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils
} from 'ethers';
import { FunctionFragment } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/providers';
import { Result } from 'ethers/lib/utils';

export interface IGammaPoolInterface extends utils.Interface {
  functions: {
    'convertToAssets(uint256)': FunctionFragment;
    'convertToShares(uint256)': FunctionFragment;
  }

  getFunction(
    nameOrSignatureOrTopic:
      | 'convertToAssets'
      | 'convertToShares'
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: 'convertToAssets',
    values: [BigNumberish],
  ): string;

  encodeFunctionData(
    functionFragment: 'convertToShares',
    values: [BigNumberish],
  ): string;

  decodeFunctionResult(
    functionFragment: 'convertToAssets',
    data: BytesLike,
  ): Result;

  decodeFunctionResult(
    functionFragment: 'convertToShares',
    data: BytesLike,
  ): Result;
}

export interface IGammaPool extends BaseContract {
  interface: IGammaPoolInterface;
  functions: {
    convertToAssets(shares: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
    convertToShares(assets: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;
  };
  callStatic: {
    convertToAssets(shares: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    convertToShares(assets: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };
  estimateGas: {
    convertToAssets(shares: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
    convertToShares(assets: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };
  populateTransaction: {
    convertToAssets(shares: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    convertToShares(assets: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };

  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  listeners(eventName?: string): Array<Listener>;

  removeAllListeners(eventName?: string): this;

  convertToAssets(shares: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  convertToShares(assets: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
}