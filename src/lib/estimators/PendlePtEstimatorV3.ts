import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import {
  getPendlePtMarketForIsolationModeToken,
  getPendlePtMaturityTimestampForIsolationModeToken,
  getPendleYtTokenForIsolationModeToken,
} from '../Constants';
import Logger from '../Logger';

const BASE_URL = 'https://api-v2.pendle.finance/sdk/api/v1';

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
    const approxParams = data.contractCallParams[3];
    const tokenInput = data.contractCallParams[4];
    const limitOrderData = data.contractCallParams[5];

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

    const tokenOutput = data.contractCallParams[3];
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
          tokenOutput.swapData.extCalldata,
          tokenOutput.swapData.needScale,
        ],
      ],
    ]);

    return { tradeData, amountOut };
  }
}
