import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { AxiosClient } from '../../clients/AxiosClient';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import {
  getPendlePtTokenForIsolationModeToken,
  getPendlePtMaturityTimestampForIsolationModeToken,
} from '../Constants';
import Logger from '../Logger';

const BASE_URL = 'https://api-v2.pendle.finance/core/v3/sdk';

const SLIPPAGE = 0.0005 // 5 bps

const TIMEOUT_MS = 10_000;

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
    private readonly debug: boolean = false,
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

    const data = await AxiosClient.post(`${BASE_URL}/${this.network.toString()}/convert`, {
      receiver: wrapper,
      slippage: SLIPPAGE,
      inputs: [
        {
          token: inputToken,
          amount: inputAmount.toFixed(),
        },
      ],
      outputs: [
        isolationModeToken,
      ],
      enableAggregator: false,
      useLimitOrder: false,
      // additionalData: {
      //   market: getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken)!,
      // },
    }, { debug: this.debug } as any)
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactTokenForPt',
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

    const route = data.routes[0];
    const amountOut = new BigNumber(route.contractParamInfo.contractCallParams[2]);
    const approxParams = route.contractParamInfo.contractCallParams[3];
    const tokenInput = route.contractParamInfo.contractCallParams[4];
    const limitOrderData = route.contractParamInfo.contractCallParams[5];

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
    const data = await AxiosClient.post(`${BASE_URL}/${this.network.toString()}/convert`, {
      receiver: unwrapper,
      slippage: SLIPPAGE,
      inputs: [
        {
          token: getPendlePtTokenForIsolationModeToken(this.network, isolationModeToken),
          amount: amountInPt.toFixed(),
        },
      ],
      outputs: [
        tokenOut,
      ],
      enableAggregator: false,
      useLimitOrder: false,
    }, { debug: this.debug } as any)
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #swapExactPtForToken',
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

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

    const route = data.routes[0];
    const tokenOutput = route.contractCallParams[3];
    const amountOut = new BigNumber(tokenOutput.minTokenOut);
    const limitOrderData = route.contractCallParams[4];
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
    const data = await AxiosClient.post(`${BASE_URL}/${this.network.toString()}/convert`, {
      receiver: unwrapper,
      slippage: SLIPPAGE,
      inputs: [
        {
          token: getPendlePtTokenForIsolationModeToken(this.network, isolationModeToken),
          amount: amountInPt.toFixed(),
        },
      ],
      outputs: [
        tokenOut,
      ],
      enableAggregator: false,
      useLimitOrder: false,
    }, { debug: this.debug, timeout: TIMEOUT_MS } as any)
      .then(result => result.data)
      .catch(e => {
        Logger.error({
          message: 'Found error in #redeemPtToToken',
          error: e.message,
          data: e.response?.data,
        });
        return Promise.reject(e);
      });

    const route = data.routes[0];

    if (route.contractParamInfo.method !== 'redeemPyToToken') {
      throw new Error('Invalid smart contract method name, expected {redeemPyToToken}');
    }

    const tokenOutput = route.contractParamInfo.contractCallParams[3];
    const amountOut = new BigNumber(tokenOutput.minTokenOut);
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
          tokenOutput.swapData.extCalldata === '' ? '0x' : tokenOutput.swapData.extCalldata,
          tokenOutput.swapData.needScale,
        ],
      ],
    ]);

    return { tradeData, amountOut };
  }
}
