import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import { getPendlePtMarketForIsolationModeToken } from '../Constants';
import Logger from '../Logger';

const BASE_URL = 'https://api-v2.pendle.finance/sdk/api/v1';

/**
 * Docs can be found at: https://api-v2.pendle.finance/sdk/
 */
export class PendlePtEstimatorV3 {
  public constructor(
    private readonly network: Network,
  ) {
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    unwrapper: Address,
    amountInPt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    const data = await axios.get(`${BASE_URL}/swapExactPtForToken`, {
      params: {
        chainId: this.network.toString(),
        receiverAddr: unwrapper,
        marketAddr: getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken)!,
        amountPtIn: amountInPt.toFixed(),
        tokenOutAddr: tokenOut,
        slippage: '0.0001', // 0.01%
      },
    })
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactPtForToken',
          error: e,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountTokenOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    wrapper: Address,
    inputAmount: Integer,
    inputToken: Address,
  ): Promise<EstimateOutputResult> {
    const data = await axios.get(`${BASE_URL}/swapExactTokenForPt`, {
      params: {
        chainId: this.network.toString(),
        receiverAddr: wrapper,
        marketAddr: getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken)!,
        tokenInAddr: inputToken,
        amountTokenIn: inputAmount.toFixed(),
        slippage: '0.0001',
      },
    })
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactTokenForPt',
          error: e,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountPtOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }
}
