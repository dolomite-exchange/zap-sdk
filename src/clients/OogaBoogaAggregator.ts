import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { OOGA_BOOGA_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';
import { AxiosClient } from './AxiosClient';

const API_URL_MAP = {
  [Network.BERACHAIN]: 'https://mainnet.api.oogabooga.io',
  [Network.BOTANIX]: 'https://botanix.api.oogabooga.io'
};

export default class OogaBoogaAggregator extends AggregatorClient {
  public constructor(network: Network, private readonly apiKey: string | undefined) {
    super(network);
    if ((network === Network.BERACHAIN || network === Network.BOTANIX) && !apiKey) {
      throw new Error('Could not find API key for BERACHAIN or BOTANIX network');
    }
  }

  public get name(): string {
    return 'Ooga Booga';
  }

  public isValidForNetwork(): boolean {
    return !!OOGA_BOOGA_TRADER_ADDRESS_MAP[this.network] && !!this.apiKey && !!API_URL_MAP[this.network];
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

    const traderAddress = OOGA_BOOGA_TRADER_ADDRESS_MAP[this.network];
    if (!traderAddress) {
      return undefined;
    }

    const queryParams = new URLSearchParams({
      tokenIn: inputMarket.tokenAddress,
      tokenOut: outputMarket.tokenAddress,
      amount: inputAmountWei.toFixed(),
      to: traderAddress,
      slippage: zapConfig.slippageTolerance.toString(),
      liquiditySourcesBlacklist: 'Burve',
      excludeDolomiteTokens: 'true',
    });
    const quoteResponse: any | Error = await AxiosClient.get(
      `${API_URL_MAP[this.network]}/v1/swap?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    ).then(response => response.data)
      .catch((error: any) => error);

    if (quoteResponse instanceof Error || !quoteResponse || quoteResponse.status !== 'Success') {
      // GUARD: If we don't have a price route, we can't execute the trade
      Logger.error({
        message: 'Found error in ooga-booga#swap',
        error: quoteResponse.message ?? null,
        data: quoteResponse.response?.data?.detail ?? null,
      });
      return undefined;
    }

    const expectedAmountOut = new BigNumber(quoteResponse.routerParams.swapTokenInfo.outputQuote);
    const tradeData = `0x${quoteResponse.tx.data.slice(10)}`; // get rid of the method ID
    return {
      traderAddress,
      tradeData,
      expectedAmountOut,
      readableName: 'Ooga Booga',
    };
  }
}
