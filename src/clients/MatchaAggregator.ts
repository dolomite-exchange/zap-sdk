import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { MATCHA_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';
import { AxiosClient } from './AxiosClient';

const API_URL = 'https://api.0x.org';

export default class MatchaAggregator extends AggregatorClient {
  public constructor(
    network: Network,
    private readonly apiKey: string | undefined,
    private readonly useProxy: boolean = false,
    private readonly debug: boolean = false,
  ) {
    super(network);
    if (debug) {
      Logger.info({
        message: 'MatchaAggregator: debug mode enabled',
        useProxy: this.useProxy,
      });
    }
  }

  public get name(): string {
    return 'Matcha';
  }

  public isValidForNetwork(): boolean {
    return !!MATCHA_TRADER_ADDRESS_MAP[this.network] && !!this.apiKey;
  }

  public async getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    _unused1: Integer,
    _unused2: Address,
    zapConfig: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    const traderAddress = MATCHA_TRADER_ADDRESS_MAP[this.network];
    if (!this.isValidForNetwork() || !traderAddress) {
      return Promise.reject(new Error('Matcha not enabled!'));
    }

    const result: any | Error = await AxiosClient.get(
      `${API_URL}/swap/allowance-holder/quote`,
      {
        params: {
          chainId: this.network.toString(),
          buyToken: outputMarket.tokenAddress,
          sellToken: inputMarket.tokenAddress,
          sellAmount: inputAmountWei.toFixed(),
          taker: traderAddress,
          sellEntireBalance: true,
          slippageBps: (zapConfig.slippageTolerance * 10000),
        },
        headers: {
          '0x-api-key': `${this.apiKey}`,
          '0x-version': 'v2'
        },
        debug: zapConfig.debug ?? this.debug,
      } as any,
    ).then(response => response.data)
      .catch(error => {
        Logger.error({
          message: 'Found error in matcha#swap',
          errorMessage: error.message,
          data: error,
        });

        return undefined;
      });

    if (!result || !result.liquidityAvailable) {
      // GUARD: If we don't have a price route, we can't execute the trade
      Logger.warn({
        message: 'MatchaAggregator: result was undefined!',
      });
      return undefined;
    }

    const expectedAmountOut = new BigNumber(result.buyAmount);
    const tradeData = `0x${result.transaction.data.slice(10)}`;
    return {
      traderAddress,
      tradeData,
      expectedAmountOut,
      readableName: 'Matcha',
    };
  }
}
