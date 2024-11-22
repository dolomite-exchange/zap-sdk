import BigNumber from 'bignumber.js';
import { AxiosClient } from '../../clients/AxiosClient';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import { getPendleYtMarketForIsolationModeToken } from '../Constants';
import Logger from '../Logger';

const BASE_URL = 'https://api-v2.pendle.finance/sdk/api/v1';

/**
 * Docs can be found at: https://api-v2.pendle.finance/sdk/
 */
export class PendleYtEstimatorV3 {
  public constructor(
    private readonly network: Network,
  ) {
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    unwrapperAddress: Address,
    amountInYt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    const data = await AxiosClient.get(`${BASE_URL}/swapExactYtForToken`, {
      params: {
        chainId: this.network.toString(),
        receiverAddr: unwrapperAddress,
        marketAddr: getPendleYtMarketForIsolationModeToken(this.network, isolationModeToken) as any,
        amountYtIn: amountInYt.toFixed(),
        tokenOutAddr: tokenOut,
        slippage: '0.0001',
      },
    })
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactYtForToken',
          error: e,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountTokenOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    wrapperAddress: Address,
    inputAmount: Integer,
    inputToken: Address,
  ): Promise<EstimateOutputResult> {
    const data = await AxiosClient.get(`${BASE_URL}/swapExactTokenForYt`, {
      params: {
        chainId: this.network.toString(),
        receiverAddr: wrapperAddress,
        marketAddr: getPendleYtMarketForIsolationModeToken(this.network, isolationModeToken) as any,
        tokenInAddr: inputToken,
        amountTokenIn: inputAmount.toFixed(),
        slippage: '0.0001',
      },
    })
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactTokenForYt',
          error: e,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountYtOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }
}
