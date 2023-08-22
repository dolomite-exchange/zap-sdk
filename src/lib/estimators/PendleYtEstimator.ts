import { BaseRouter as PendleRouter, Router as PendleStaticRouter } from '@pendle/sdk-v2';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, Integer, Network } from '../ApiTypes';
import { getPendleMarketForIsolationModeToken, getSGlpAddress } from '../Constants';

export class PendleYtEstimator {
  private readonly network: Network;
  private pendleRouter: PendleRouter;

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

  public set web3Provider(web3Provider: ethers.providers.Provider) {
    this.pendleRouter = PendleStaticRouter.getRouter({
      chainId: this.network as any,
      provider: web3Provider,
      signer: new ethers.VoidSigner('0x1234567812345678123456781234567812345678', web3Provider),
    });
  }

  public async getUnwrappedAmount(
    isolationModeToken: Address,
    amountInYt: Integer,
  ): Promise<{ tradeData: string; outputAmount: Integer }> {
    const [, , , tokenOutput] = await this.pendleRouter.swapExactYtForToken(
      getPendleMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      amountInYt.toFixed(),
      getSGlpAddress(this.network) as any,
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

    const outputAmount = new BigNumber(tokenOutput.minTokenOut.toString());
    return { tradeData, outputAmount };
  }

  public async getWrappedAmount(
    isolationModeToken: Address,
    inputAmount: Integer,
  ): Promise<{ tradeData: string; ytAmountOut: Integer }> {
    const [, , , approxParams, tokenInput] = await this.pendleRouter.swapExactTokenForYt(
      getPendleMarketForIsolationModeToken(this.network, isolationModeToken) as any,
      getSGlpAddress(this.network)?.toLowerCase() as any,
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

    const ytAmountOut = new BigNumber(approxParams.guessOffchain.toString());
    return { tradeData, ytAmountOut };
  }
}
