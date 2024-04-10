import { BaseRouter as PendleRouter } from '@pendle/sdk-v2';
import { Router as PendleStaticRouter } from '@pendle/sdk-v2/dist/entities/Router/Router';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, EstimateOutputResult, Integer, Network } from '../ApiTypes';
import {
  getPendlePtMarketForIsolationModeToken,
  getPendlePtMaturityTimestampForIsolationModeToken
} from '../Constants';

export class PendlePtEstimatorV2 {
  private readonly pendleRouter?: PendleRouter;

  public constructor(
    private readonly network: Network,
    web3Provider: ethers.providers.Provider,
  ) {
    if (network === Network.ARBITRUM_ONE) {
      this.pendleRouter = PendleStaticRouter.getRouter({
        chainId: network as any,
        provider: web3Provider,
        signer: new ethers.VoidSigner('0x1234567812345678123456781234567812345678', web3Provider),
      });
    }
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    amountInPt: Integer,
    tokenOut: Address,
  ): Promise<EstimateOutputResult> {
    if (this.isMature(isolationModeToken)) {
      return Promise.reject(new Error('MATURED'));
    }

    const [, , , tokenOutput] = await this.pendleRouter!.swapExactPtForToken(
      getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      amountInPt.toFixed(),
      tokenOut as any,
      0,
      { method: 'extractParams' },
    );

    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address,uint256,address,address,address,tuple(uint8,address,bytes,bool))'],
      [
        [
          tokenOutput.tokenOut,
          /* tokenOutput.minTokenOut = */ '1',
          tokenOutput.tokenRedeemSy,
          tokenOutput.bulk,
          tokenOutput.pendleSwap,
          [
            tokenOutput.swapData.swapType,
            tokenOutput.swapData.extRouter,
            tokenOutput.swapData.extCalldata,
            tokenOutput.swapData.needScale,
          ],
        ],
      ],
    );

    const amountOut = new BigNumber(tokenOutput.minTokenOut.toString());

    return { tradeData, amountOut };
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    inputAmount: Integer,
    inputToken: Address,
  ): Promise<EstimateOutputResult> {
    if (this.isMature(isolationModeToken)) {
      return Promise.reject(new Error('MATURED'));
    }

    const [, , , approxParams, tokenInput] = await this.pendleRouter!.swapExactTokenForPt(
      getPendlePtMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      inputToken as any,
      inputAmount.toFixed(),
      0,
      { method: 'extractParams' },
    );

    const approxParamsType = 'tuple(uint256,uint256,uint256,uint256,uint256)';
    const tokenInputType = 'tuple(address,uint256,address,address,address,tuple(uint8,address,bytes,bool))';
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      [approxParamsType, tokenInputType],
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
          tokenInput.bulk,
          tokenInput.pendleSwap,
          [
            tokenInput.swapData.swapType,
            tokenInput.swapData.extRouter,
            tokenInput.swapData.extCalldata,
            tokenInput.swapData.needScale,
          ],
        ],
      ],
    );

    const amountOut = new BigNumber(approxParams.guessOffchain.toString());
    return { tradeData, amountOut };
  }

  private isMature(isolationModeToken: Address): boolean {
    const maturityTimestamp = getPendlePtMaturityTimestampForIsolationModeToken(this.network, isolationModeToken);
    return (maturityTimestamp ?? 0) < Math.floor(Date.now() / 1000);
  }
}
