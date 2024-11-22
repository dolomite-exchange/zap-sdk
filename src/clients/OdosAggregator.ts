import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { DOLOMITE_API_SERVER_URL, ODOS_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';
import { AxiosClient } from './AxiosClient';

const PROXY_API_URL = `${DOLOMITE_API_SERVER_URL}/aggregator/odos`;
const API_URL = 'https://api.odos.xyz';

export default class OdosAggregator extends AggregatorClient {
  private readonly referralCode: Integer | undefined;
  private readonly useProxy: boolean;

  public constructor(network: Network, referralCode: Integer | undefined, useProxy: boolean) {
    super(network);
    this.referralCode = referralCode;
    this.useProxy = useProxy;
  }

  public isValidForNetwork(): boolean {
    return !!ODOS_TRADER_ADDRESS_MAP[this.network];
  }

  public get name(): string {
    return 'Odos';
  }

  public async getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    _unused1: Integer,
    _unused2: Address,
    zapConfig: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    const traderAddress = ODOS_TRADER_ADDRESS_MAP[this.network];
    if (!traderAddress) {
      return undefined;
    }

    const quoteResponse = await AxiosClient.post(this.useProxy ? `${PROXY_API_URL}/quote` : `${API_URL}/sor/quote/v2`, {
      chainId: this.network, // Replace with desired chainId
      inputTokens: [
        {
          tokenAddress: inputMarket.tokenAddress,
          amount: inputAmountWei.toFixed(),
        },
      ],
      outputTokens: [
        {
          tokenAddress: outputMarket.tokenAddress,
          proportion: 1,
        },
      ],
      userAddr: traderAddress,
      // zapConfig.slippageTolerance is described as 0.003 == 30 bips
      slippageLimitPercent: zapConfig.slippageTolerance * 100,
      referralCode: this.referralCode?.toFixed() ?? undefined,
      disableRFQs: true,
      compact: false,
    }).then(response => response.data)
      .catch((error) => error);

    if (!quoteResponse || !quoteResponse.pathId) {
      // GUARD: If we don't have a price route, we can't execute the trade
      Logger.error({
        message: 'Found error in odos#quote',
        error: quoteResponse.message ?? null,
        data: quoteResponse.response?.data?.detail ?? null,
      });
      return undefined;
    }

    const result = await AxiosClient.post(this.useProxy ? `${PROXY_API_URL}/assemble` : `${API_URL}/sor/assemble`, {
      userAddr: traderAddress,
      pathId: quoteResponse.pathId,
      simulate: false,
    })
      .then(response => response.data)
      .catch(error => {
        Logger.error({
          message: 'Found error in odos#assemble',
          errorMessage: error.message,
          data: error,
        });

        return undefined;
      });
    if (!result) {
      // GUARD: If we don't have the result, we can't execute the trade
      Logger.warn({
        message: 'OdosAggregator: result was undefined!',
      });
      return undefined;
    }

    const expectedAmountOut = new BigNumber(result.outputTokens?.[0]?.amount);
    const tradeData = `0x${result.transaction.data.slice(10)}`; // get rid of the method ID
    return {
      traderAddress,
      tradeData,
      expectedAmountOut,
      readableName: 'Odos',
    };
  }
}
