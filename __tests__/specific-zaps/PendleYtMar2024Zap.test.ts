import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, Network } from '../../src';
import { SLEEP_DURATION_BETWEEN_TESTS, USDC_MARKET, YT_GLP_MARKET } from '../helpers/TestConstants';
import sleep from '../helpers/sleep';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('PendleYtGlpMar2024Zap', () => {
  const network = Network.ARBITRUM_ONE;
  const subgraphUrl = process.env.SUBGRAPH_URL;
  if (!subgraphUrl) {
    throw new Error('SUBGRAPH_URL env var not set');
  }
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const NO_CACHE = -1;
  const zap = new DolomiteZap({
    network,
    subgraphUrl,
    web3Provider,
    cacheSeconds: NO_CACHE,
  });
  zap.setMarketsToAdd([YT_GLP_MARKET]);

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('Pendle YT-GLP', () => {
      it('should work when unwrapping YT-GLP', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 YT
        const minAmountOut = new BigNumber('1000000'); // 1 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          YT_GLP_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          { filterOutZapsWithInsufficientOutput: false },
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(YT_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendleYtGLP2024IsolationModeUnwrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping YT-GLP', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('1000000000000000000000'); // 1,000 YT
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          YT_GLP_MARKET,
          minAmountOut,
          txOrigin,
          { filterOutZapsWithInsufficientOutput: false },
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(YT_GLP_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendleYtGLP2024IsolationModeWrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});
