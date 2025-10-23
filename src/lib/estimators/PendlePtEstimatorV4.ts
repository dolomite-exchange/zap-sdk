import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { AxiosClient } from '../../clients/AxiosClient';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import {
  getPendlePtMarketForIsolationModeToken,
  getPendlePtMaturityTimestampForIsolationModeToken,
  getPendlePtTokenForIsolationModeToken,
  getPendleYtTokenForIsolationModeToken
} from '../Constants';
import Logger from '../Logger';

const BASE_URL = 'https://api-v2.pendle.finance/core/v2/sdk';

const ORDER_COMPONENTS = {
  type: 'tuple',
  name: 'order',
  components: [
    { name: 'salt', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'orderType', type: 'uint8' },
    { name: 'token', type: 'address' },
    { name: 'YT', type: 'address' },
    { name: 'maker', type: 'address' },
    { name: 'receiver', type: 'address' },
    { name: 'makingAmount', type: 'uint256' },
    { name: 'lnImpliedRate', type: 'uint256' },
    { name: 'failSafeRate', type: 'uint256' },
    { name: 'permit', type: 'bytes' },
  ],
};

/**
 * Docs can be found at: https://api-v2.pendle.finance/sdk/
 */
export class PendlePtEstimatorV4 {
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

    const market = getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken)!;
    const data = await AxiosClient.get(`${BASE_URL}/${this.network.toString()}/markets/${market}/swap`, {
      params: {
        receiver: wrapper,
        slippage: '0.0001',
        tokenIn: inputToken,
        amountIn: inputAmount.toFixed(),
        tokenOut: getPendlePtTokenForIsolationModeToken(this.network, isolationModeToken)!,
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

    const amountOut = new BigNumber(data.data.amountOut);
    const approxParams = data.contractCallParams[3];
    const tokenInput = data.contractCallParams[4];
    const limitOrderData = data.contractCallParams[5];

    tokenInput.swapData.extCalldata = tokenInput.swapData.extCalldata ? tokenInput.swapData.extCalldata : '0x';

    const approxParamsType = 'tuple(uint256,uint256,uint256,uint256,uint256)';
    const tokenInputType = 'tuple(address,uint256,address,address,tuple(uint8,address,bytes,bool))';
    const limitOrderDataInputType = {
      type: 'tuple',
      name: 'limitOrderData',
      components: [
        { name: 'limitRouter', type: 'address' },
        { name: 'epsSkipMarket', type: 'uint256' },
        {
          type: 'tuple[]',
          name: 'normalFills',
          components: [
            ORDER_COMPONENTS,
            { name: 'signature', type: 'bytes' },
            { name: 'makingAmount', type: 'uint256' },
          ],
        },
        {
          type: 'tuple[]',
          name: 'flashFills',
          components: [
            ORDER_COMPONENTS,
            { name: 'signature', type: 'bytes' },
            { name: 'makingAmount', type: 'uint256' },
          ],
        },
        { name: 'optData', type: 'bytes' },
      ],
    };
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      [approxParamsType, tokenInputType, limitOrderDataInputType as any],
      [
        [
          approxParams.guessMin,
          approxParams.guessMax,
          approxParams.guessOffchain,
          approxParams.maxIteration,
          approxParams.eps,
        ],
        [
          tokenInput.tokenIn,
          tokenInput.netTokenIn,
          tokenInput.tokenMintSy,
          tokenInput.pendleSwap,
          [
            tokenInput.swapData.swapType,
            tokenInput.swapData.extRouter,
            tokenInput.swapData.extCalldata,
            tokenInput.swapData.needScale,
          ],
        ],
        limitOrderData,
      ],
    );

    return { tradeData, amountOut };
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
    const market = getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken)!;
    const data = await AxiosClient.get(`${BASE_URL}/${this.network.toString()}/markets/${market}/swap`, {
      params: {
        receiver: unwrapper,
        slippage: '0.0001', // 0.01%
        tokenIn: getPendlePtTokenForIsolationModeToken(this.network, isolationModeToken)!,
        amountIn: amountInPt.toFixed(),
        tokenOut: tokenOut,
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

    const amountOut = new BigNumber(data.data.amountOut);

    const EXTRA_ORDER_DATA_TYPE = [
      {
        type: 'tuple',
        name: 'tokenOutput',
        components: [
          { name: 'tokenOut', type: 'address' },
          { name: 'minTokenOut', type: 'uint256' },
          { name: 'tokenRedeemSy', type: 'address' },
          { name: 'pendleSwap', type: 'address' },
          {
            type: 'tuple',
            name: 'swapData',
            components: [
              { name: 'swapType', type: 'uint8' },
              { name: 'extRouter', type: 'address' },
              { name: 'extCalldata', type: 'bytes' },
              { name: 'needScale', type: 'bool' },
            ],
          },
        ],
      },
      {
        type: 'tuple',
        name: 'limitOrderData',
        components: [
          { name: 'limitRouter', type: 'address' },
          { name: 'epsSkipMarket', type: 'uint256' },
          {
            type: 'tuple[]',
            name: 'normalFills',
            components: [
              ORDER_COMPONENTS,
              { name: 'signature', type: 'bytes' },
              { name: 'makingAmount', type: 'uint256' },
            ],
          },
          {
            type: 'tuple[]',
            name: 'flashFills',
            components: [
              ORDER_COMPONENTS,
              { name: 'signature', type: 'bytes' },
              { name: 'makingAmount', type: 'uint256' },
            ],
          },
          { name: 'optData', type: 'bytes' },
        ],
      },
    ];

    const tokenOutput = data.contractCallParams[3];
    const limitOrderData = data.contractCallParams[4];

    tokenOutput.swapData.extCalldata = tokenOutput.swapData.extCalldata ? tokenOutput.swapData.extCalldata : '0x';

    const tradeData = ethers.utils.defaultAbiCoder.encode(
      EXTRA_ORDER_DATA_TYPE as any,
      [
        [
          tokenOutput.tokenOut,
          tokenOutput.minTokenOut,
          tokenOutput.tokenRedeemSy,
          tokenOutput.pendleSwap,
          [
            tokenOutput.swapData.swapType,
            tokenOutput.swapData.extRouter,
            tokenOutput.swapData.extCalldata,
            tokenOutput.swapData.needScale,
          ],
        ],
        limitOrderData,
      ],
    );

    return { tradeData, amountOut };
  }

  private async redeemPtToToken(
    isolationModeToken: Address,
    unwrapper: Address,
    amountInPt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    const data = await AxiosClient.get(`${BASE_URL}/${this.network.toString()}/redeem`, {
      params: {
        receiver: unwrapper,
        slippage: '0.0001', // 0.01%
        yt: getPendleYtTokenForIsolationModeToken(this.network, isolationModeToken)!,
        amountIn: amountInPt.toFixed(),
        tokenOut: tokenOut,
      },
    })
      .then(result => result.data)
      .catch(e => {
        console.log(e.response?.data);
        console.log(e.message);
        Logger.error({
          message: 'Found error in #redeem',
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

    const amountOut = new BigNumber(data.data.amountOut);
    const tokenOutput = data.contractCallParams[3];

    const extCalldata = tokenOutput.swapData.extCalldata ? tokenOutput.swapData.extCalldata : '0x';

    const tradeData = ethers.utils.defaultAbiCoder.encode([
      {
        type: 'tuple',
        name: 'tokenOutput',
        components: [
          { name: 'tokenOut', type: 'address' },
          { name: 'minTokenOut', type: 'uint256' },
          { name: 'tokenRedeemSy', type: 'address' },
          { name: 'pendleSwap', type: 'address' },
          {
            type: 'tuple',
            name: 'swapData',
            components: [
              { name: 'swapType', type: 'uint8' },
              { name: 'extRouter', type: 'address' },
              { name: 'extCalldata', type: 'bytes' },
              { name: 'needScale', type: 'bool' },
            ],
          },
        ],
      },
    ] as any, [
      [
        tokenOutput.tokenOut,
        tokenOutput.minTokenOut,
        tokenOutput.tokenRedeemSy,
        tokenOutput.pendleSwap,
        [
          tokenOutput.swapData.swapType,
          tokenOutput.swapData.extRouter,
          extCalldata,
          tokenOutput.swapData.needScale,
        ],
      ],
    ]);

    return { tradeData, amountOut };
  }
}
