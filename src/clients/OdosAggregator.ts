import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { ODOS_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';

const PROXY_API_URL = 'https://proxy.dolomite.io/aggregator/odos';
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

    const quoteResponse = await axios.post(this.useProxy ? `${PROXY_API_URL}/quote` : `${API_URL}/sor/quote/v2`, {
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
      .catch((error) => {
        Logger.error({
          message: 'Found error in odos#quote',
          error,
        });
        return undefined;
      });
    if (!quoteResponse) {
      // GUARD: If we don't have a price route, we can't execute the trade
      return undefined;
    }

    const result = await axios.post(this.useProxy ? `${PROXY_API_URL}/assemble` : `${API_URL}/sor/assemble`, {
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
