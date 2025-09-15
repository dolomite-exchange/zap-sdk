import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { ENSO_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';
import { AxiosClient } from './AxiosClient';
import { defaultAbiCoder } from 'ethers/lib/utils';

const API_URL = 'https://api.enso.finance';

export default class EnsoAggregator extends AggregatorClient {
  public constructor(network: Network, private readonly apiKey: string | undefined) {
    super(network);
    if (!apiKey) {
      throw new Error('Could not find API key for Enso');
    }
  }

  public get name(): string {
    return 'Enso';
  }

  public isValidForNetwork(): boolean {
    return !!ENSO_TRADER_ADDRESS_MAP[this.network] && !!this.apiKey;
  }

  public async getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    _unused1: Integer,
    _unused2: Address,
    zapConfig: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    if (!this.apiKey) {
      return Promise.reject(new Error('No API key is set for Ooga Booga!'));
    }

    const traderAddress = ENSO_TRADER_ADDRESS_MAP[this.network];
    if (!traderAddress) {
      return undefined;
    }

    const result: any | Error = await AxiosClient.post(
      `${API_URL}/api/v1/shortcuts/route`,
      {
        chainId: this.network.toString(),
        fromAddress: traderAddress,
        amountIn: '$amount1',
        slippage: (zapConfig.slippageTolerance * 10000).toFixed(),
        tokenIn: inputMarket.tokenAddress,
        tokenOut: outputMarket.tokenAddress,
        routingStrategy: 'router',
        variableEstimates: {
          $amount1: inputAmountWei.toFixed(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    ).then(response => response.data)
      .catch(error => {
        Logger.error({
          message: 'Found error in enso#swap',
          errorMessage: error.message,
          data: error,
        });

        return undefined;
      });

    if (!result) {
      // GUARD: If we don't have a price route, we can't execute the trade
      Logger.warn({
        message: 'EnsoAggregator: result was undefined!',
      });
      return undefined;
    }

    const expectedAmountOut = new BigNumber(result.amountOut);
    const [index, updatedCalldata] = this._getIndexAndUpdateCalldata(result.tx.data);

    return {
      traderAddress,
      tradeData: defaultAbiCoder.encode(['uint256', 'bytes'], [index, updatedCalldata]),
      expectedAmountOut,
      readableName: 'Enso',
    };
  }

  private _getIndexAndUpdateCalldata(calldata: string): [number, string] {
    const index = calldata.indexOf('{$amount1}');
    if (index === -1) {
      throw new Error('{$amount1} not found');
    }
    // replace {$amount1} with bytes32(0) and remove the 0x prefix
    calldata = calldata.replace('{$amount1}', defaultAbiCoder.encode(['uint256'], [0]).slice(2));

    // we remove the first 10 characters of the calldata (0x + function selector)
    // then divide index by 2 because 2 char = 1 byte
    return [(index - 10) / 2, `0x${calldata.slice(10)}`];
  }
}
