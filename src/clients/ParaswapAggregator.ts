import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';
import { PARASWAP_TRADER_ADDRESS_MAP } from '../lib/Constants';
import Logger from '../lib/Logger';
import AggregatorClient from './AggregatorClient';

// const PROXY_API_URL = 'https://proxy.dolomite.io/aggregator/paraswap';
const API_URL = 'https://apiv5.paraswap.io';

export default class ParaswapAggregator extends AggregatorClient {
  private readonly partnerAddress: Address | undefined;
  // @ts-ignore
  private readonly useProxy: boolean;

  public constructor(network: Network, partnerAddress: Address | undefined, useProxy: boolean) {
    super(network);
    this.partnerAddress = partnerAddress;
    this.useProxy = useProxy;
  }

  public get name(): string {
    return 'Paraswap';
  }

  public get address(): Address {
    return PARASWAP_TRADER_ADDRESS_MAP[this.network]!;
  }

  public isValidForNetwork(): boolean {
    return !!PARASWAP_TRADER_ADDRESS_MAP[this.network];
  }

  public async getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    minOutputAmountWei: Integer,
    txOrigin: Address,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unused: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    const traderAddress = PARASWAP_TRADER_ADDRESS_MAP[this.network];
    if (!traderAddress) {
      return undefined;
    }

    const pricesQueryParams = new URLSearchParams({
      network: this.network.toString(),
      srcToken: inputMarket.tokenAddress,
      srcDecimals: inputMarket.decimals.toString(),
      destToken: outputMarket.tokenAddress,
      destDecimals: outputMarket.decimals.toString(),
      amount: inputAmountWei.toFixed(),
      includeContractMethods: 'megaSwap,multiSwap,simpleSwap',
      partner: 'dolomite',
    }).toString();

    // const priceRouteResponse = await (this.useProxy
    //   ? axios.post(`${PROXY_API_URL}/quote?${pricesQueryParams}`)
    //   : axios.get(`${API_URL}/prices?${pricesQueryParams}`))

    const priceRouteResponse = await axios.get(`${API_URL}/prices?${pricesQueryParams}`)
      .then(response => response.data)
      .catch((error) => error);
    if (!priceRouteResponse || !priceRouteResponse.priceRoute || priceRouteResponse?.response?.data?.error) {
      // GUARD: If we don't have a price route, we can't execute the trade
      Logger.error({
        message: 'Found error in paraswap#prices',
        errorMessage: priceRouteResponse?.message ?? null,
        data: priceRouteResponse?.response?.data?.error ?? null,
      });
      return undefined;
    }

    const transactionsQueryParams = new URLSearchParams({
      ignoreChecks: 'true',
      ignoreGasEstimate: 'true',
      onlyParams: 'false',
    }).toString();

    // const result = await axios.post(this.useProxy
    //   ? `${PROXY_API_URL}/assemble?${transactionsQueryParams}`
    //   : `${API_URL}/transactions/${this.network}?${transactionsQueryParams}`, {

    const result = await axios.post(`${API_URL}/transactions/${this.network}?${transactionsQueryParams}`, {
      txOrigin,
      priceRoute: priceRouteResponse?.priceRoute,
      srcToken: inputMarket.tokenAddress,
      srcDecimals: inputMarket.decimals,
      destToken: outputMarket.tokenAddress,
      destDecimals: outputMarket.decimals,
      srcAmount: inputAmountWei.toFixed(),
      destAmount: minOutputAmountWei.toFixed(),
      userAddress: traderAddress,
      receiver: traderAddress,
      partnerAddress: this.partnerAddress,
      partner: 'dolomite',
      takeSurplus: !!this.partnerAddress, // if there's a partner address, positive slippage goes to the partner
    })
      .then(response => response.data)
      .catch(error => {
        Logger.error({
          message: 'Found error in paraswap#transactions',
          errorMessage: error.message,
          data: error.data,
        });

        return undefined;
      });
    if (!result) {
      // GUARD: If we don't have the result, we can't execute the trade
      Logger.warn({
        message: 'ParaswapAggregator: result was undefined!',
      });
      return undefined;
    } else if (!result.data) {
      Logger.error({
        message: 'ParaswapAggregator result.data is undefined',
        result,
      });
      return undefined;
    }

    const expectedAmountOut = new BigNumber(priceRouteResponse?.priceRoute?.destAmount);
    const calldata = result.data.toString();
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['bytes4', 'bytes'],
      [`0x${calldata.slice(2, 10)}`, `0x${calldata.slice(10)}`],
    );
    return {
      traderAddress,
      tradeData,
      expectedAmountOut,
      readableName: 'Paraswap',
    };
  }
}
