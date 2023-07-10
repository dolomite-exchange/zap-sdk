import { BaseRouter as PendleRouter, Router as PendleStaticRouter } from '@pendle/sdk-v2';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, Integer, Network, ZapConfig } from '../ApiTypes';
import { getPendleMarketForIsolationModeToken, getSGlpAddress } from '../Constants';

export class PendlePtEstimator {
  private readonly network: Network;
  private readonly pendleRouter: PendleRouter;

  public constructor(
    network: Network,
    web3Provider: ethers.providers.Provider,
  ) {
    this.network = network;
    this.pendleRouter = PendleStaticRouter.getRouter({
      chainId: network as any,
      provider: web3Provider,
      signer: new ethers.VoidSigner('0x1234567812345678123456781234567812345678', web3Provider),
    });
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    amountInPt: Integer,
    config: ZapConfig,
  ): Promise<{ tradeData: string; outputAmount: Integer }> {
    const [, , , tokenOutput] = await this.pendleRouter.swapExactPtForToken(
      getPendleMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      amountInPt.toFixed(),
      getSGlpAddress(this.network) as any,
      config.slippageTolerance,
      { method: 'extractParams' },
    );

    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['tuple(address,uint256,address,address,address,tuple(uint8,address,bytes,bool))'],
      [
        [
          tokenOutput.tokenOut,
          tokenOutput.minTokenOut,
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

    // We don't want to double-count slippage, so remove it
    const outputAmountWithSlippage = new BigNumber(tokenOutput.minTokenOut.toString());
    const outputAmount = outputAmountWithSlippage.dividedToIntegerBy(1 - config.slippageTolerance).minus(1);
    return { tradeData, outputAmount };
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    inputAmount: Integer,
    config: ZapConfig,
  ): Promise<{ tradeData: string; ptAmountOut: Integer }> {
    const [, , , approxParams, tokenInput] = await this.pendleRouter.swapExactTokenForPt(
      getPendleMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      getSGlpAddress(this.network) as any,
      inputAmount.toFixed(),
      config.slippageTolerance,
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

    // We don't want to double-count slippage, so remove it
    const ptAmountOutWithSlippage = new BigNumber(approxParams.guessOffchain.toString());
    const ptAmountOut = ptAmountOutWithSlippage.dividedToIntegerBy(1 - config.slippageTolerance).minus(1);
    return { tradeData, ptAmountOut };
  }
}
