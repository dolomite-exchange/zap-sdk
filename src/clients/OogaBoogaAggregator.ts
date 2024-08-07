import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { OOGA_BOOGA_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';

const API_URL = 'https://testnet.api.oogabooga.io';

export default class OogaBoogaAggregator extends AggregatorClient {
  public constructor(network: Network) {
    super(network);
  }

  public get name(): string {
    return 'Ooga Booga';
  }

  public isValidForNetwork(): boolean {
    return !!OOGA_BOOGA_TRADER_ADDRESS_MAP[this.network];
  }

  public async getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    _unused1: Integer,
    _unused2: Address,
    zapConfig: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    const traderAddress = OOGA_BOOGA_TRADER_ADDRESS_MAP[this.network];
    if (!traderAddress) {
      return undefined;
    }

    const queryParams = new URLSearchParams({
      chainId: this.network.toString(), // Replace with desired chainId
      tokenIn: inputMarket.tokenAddress,
      tokenOut: outputMarket.tokenAddress,
      amount: inputAmountWei.toFixed(),
      from: traderAddress,
      slippage: zapConfig.slippageTolerance.toString(),
    });
    const quoteResponse: any | Error = await axios.get(
      `${API_URL}/v1/swap?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.OOGA_BOOGA_SECRET_KEY}`,
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

    const expectedAmountOut = new BigNumber(quoteResponse.assumedAmountOut);
    const tradeData = `0x${quoteResponse.tx.data.slice(10)}`; // get rid of the method ID
    return {
      traderAddress,
      tradeData,
      expectedAmountOut,
      readableName: 'Ooga Booga',
    };
  }
}
