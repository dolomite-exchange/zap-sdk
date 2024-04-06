import axios from 'axios';
import BigNumber from 'bignumber.js';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import {
  getPendlePtMarketForIsolationModeToken,
  getPendlePtMaturityTimestampForIsolationModeToken, getPendleYtTokenForIsolationModeToken,
} from '../Constants';
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

  private isMature(isolationModeToken: Address): boolean {
    const maturityTimestamp = getPendlePtMaturityTimestampForIsolationModeToken(this.network, isolationModeToken);
    return (maturityTimestamp ?? 0) < Math.floor(Date.now() / 1000);
  }

  private async swapPtToToken(
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
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountTokenOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }

  private async redeemPtToToken(
    isolationModeToken: Address,
    unwrapper: Address,
    amountInPt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    const data = await axios.get(`${BASE_URL}/redeemPyToToken`, {
      params: {
        chainId: this.network.toString(),
        receiverAddr: unwrapper,
        ytAddr: getPendleYtTokenForIsolationModeToken(this.network, isolationModeToken)!,
        amountPyIn: amountInPt.toFixed(),
        tokenOutAddr: tokenOut,
        slippage: '0.0001',
      },
    })
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #redeemPyToToken',
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountTokenOut);

    return { tradeData: `0x${data.transaction.data.slice(10)}`, amountOut };
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    unwrapper: Address,
    amountInPt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    if (this.isMature(isolationModeToken)) {
      return this.redeemPtToToken(isolationModeToken, unwrapper, amountInPt, tokenOut);
    } else {
      return this.swapPtToToken(isolationModeToken, unwrapper, amountInPt, tokenOut)
    }
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    wrapper: Address,
    inputAmount: Integer,
    inputToken: Address,
  ): Promise<EstimateOutputResult> {
    if (this.isMature(isolationModeToken)) {
      return Promise.reject(new Error('MATURED'));
    }

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
