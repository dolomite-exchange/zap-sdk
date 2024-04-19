import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, Network } from '../../src';
import sleep from '../helpers/sleep';
import {
  GLP_MARKET,
  NATIVE_USDC_MARKET,
  PT_GLP_SEP_2024_MARKET,
  SLEEP_DURATION_BETWEEN_TESTS,
  USDC_MARKET,
} from '../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('PendlePtGlpSep2024Zap', () => {
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

  beforeEach(async () => {
    // Sleep so Paraswap / Pendle does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('Pendle PT-GLP', () => {
      it('should work when unwrapping PT-GLP', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 PT
        const minAmountOut = new BigNumber('50000000'); // 50 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          PT_GLP_SEP_2024_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(PT_GLP_SEP_2024_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendlePtGLPSep2024IsolationModeUnwrapperTraderV3[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader).toEqual(Deployments.GLPUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toEqual(2);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when unwrapping PT-GLP with aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 PT
        const minAmountOut = new BigNumber('50000000'); // 50 native USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          PT_GLP_SEP_2024_MARKET,
          amountIn,
          NATIVE_USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(2);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(4);
        expect(outputParam.marketIdsPath[0]).toEqual(PT_GLP_SEP_2024_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[3]).toEqual(NATIVE_USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(4);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[3].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(3);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendlePtGLPSep2024IsolationModeUnwrapperTraderV3[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader).toEqual(Deployments.GLPUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toEqual(2);

        expect(outputParam.traderParams[2].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[2].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[2].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping PT-GLP', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 PT
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          PT_GLP_SEP_2024_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];

        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(PT_GLP_SEP_2024_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader).toEqual(Deployments.GLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toEqual(2);

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.PendlePtGLPSep2024IsolationModeWrapperTraderV3[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping PT-GLP with aggregator', async () => {
        const amountIn = new BigNumber('100000000'); // 100 native USDC
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 PT
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          NATIVE_USDC_MARKET,
          amountIn,
          PT_GLP_SEP_2024_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(2);
        const outputParam = outputParams[0];

        expect(outputParam.marketIdsPath.length).toEqual(4);
        expect(outputParam.marketIdsPath[0]).toEqual(NATIVE_USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[3]).toEqual(PT_GLP_SEP_2024_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(4);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[3].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(3);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader).toEqual(Deployments.GLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toEqual(2);

        expect(outputParam.traderParams[2].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[2].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[2].trader)
          .toEqual(Deployments.PendlePtGLPSep2024IsolationModeWrapperTraderV3[network].address);
        expect(outputParam.traderParams[2].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});
