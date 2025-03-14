import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, Network } from '../../../src';
import { BYTES_EMPTY } from '../../../src/lib/Constants';
import { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP } from '../../../src/lib/MarketIds';
import { ARB_MARKET, USDC_MARKET, VOTE_ENABLED_ARB_MARKET } from '../../helpers/ArbitrumOneConstants';
import sleep from '../../helpers/sleep';
import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('VoteEnabledArbZap', () => {
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
  zap.setMarketsToAdd([VOTE_ENABLED_ARB_MARKET]);

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work when unwrapping vARB to ARB', async () => {
      const amountIn = new BigNumber('100000000000000000000'); // 100 vARB
      const minAmountOut = new BigNumber('100000000000000000000'); // 100 ARB
      const outputParams = await zap.getSwapExactTokensForTokensParams(
        VOTE_ENABLED_ARB_MARKET,
        amountIn,
        ARB_MARKET,
        minAmountOut,
        txOrigin,
      );

      expect(outputParams.length).toBe(1);

      const vArbMarketId = VOTE_ENABLED_ARB_MARKET.marketId;
      const outputParam = outputParams[0];
      expect(outputParam.marketIdsPath.length).toEqual(2);
      expect(outputParam.marketIdsPath[0]).toEqual(vArbMarketId);
      expect(outputParam.marketIdsPath[1]).toEqual(ARB_MARKET.marketId);

      expect(outputParam.amountWeisPath.length).toEqual(2);
      expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
      expect(outputParam.amountWeisPath[1]).toEqual(amountIn.minus(amountIn.times(zap.defaultSlippageTolerance)));

      expect(outputParam.traderParams.length).toEqual(1);
      expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
      expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
      expect(outputParam.traderParams[0].trader)
        .toEqual(Deployments.ARBIsolationModeUnwrapperTraderV4[network].address);
      expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

      expect(outputParam.makerAccounts.length).toEqual(0);
      expect(outputParam.expectedAmountOut.eq(amountIn)).toBeTruthy();
      expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
    });

    it('should work when unwrapping vARB to non-ARB', async () => {
      const amountIn = new BigNumber('100000000000000000000'); // 100 vARB
      const minAmountOut = new BigNumber('50000000'); // 50 USDC
      const outputParams = await zap.getSwapExactTokensForTokensParams(
        VOTE_ENABLED_ARB_MARKET,
        amountIn,
        USDC_MARKET,
        minAmountOut,
        txOrigin,
      );

      expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

      const vArbMarketId = VOTE_ENABLED_ARB_MARKET.marketId;
      const outputParam = outputParams[0];
      expect(outputParam.marketIdsPath.length).toEqual(3);
      expect(outputParam.marketIdsPath[0]).toEqual(vArbMarketId);
      expect(outputParam.marketIdsPath[1])
        .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][vArbMarketId.toFixed()]!.unwrapperMarketIds[0]);
      expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

      expect(outputParam.amountWeisPath.length).toEqual(3);
      expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
      expect(outputParam.amountWeisPath[1]).toEqual(amountIn);
      expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

      expect(outputParam.traderParams.length).toEqual(2);
      expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
      expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
      expect(outputParam.traderParams[0].trader)
        .toEqual(Deployments.ARBIsolationModeUnwrapperTraderV4[network].address);
      expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

      expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
      expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);

      expect(outputParam.makerAccounts.length).toEqual(0);
      expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
        .toBeTruthy();
      expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
    });

    it('should work when wrapping vARB from ARB', async () => {
      const amountIn = new BigNumber('100000000000000000000'); // 100 vARB
      const minAmountOut = new BigNumber('100000000000000000000'); // 100 ARB
      const outputParams = await zap.getSwapExactTokensForTokensParams(
        ARB_MARKET,
        amountIn,
        VOTE_ENABLED_ARB_MARKET,
        minAmountOut,
        txOrigin,
      );

      expect(outputParams.length).toBe(1);

      const vArbMarketId = VOTE_ENABLED_ARB_MARKET.marketId;
      const outputParam = outputParams[0];
      expect(outputParam.marketIdsPath.length).toEqual(2);
      expect(outputParam.marketIdsPath[0]).toEqual(ARB_MARKET.marketId);
      expect(outputParam.marketIdsPath[1]).toEqual(vArbMarketId);

      expect(outputParam.amountWeisPath.length).toEqual(2);
      expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
      expect(outputParam.amountWeisPath[1]).toEqual(amountIn.minus(amountIn.times(zap.defaultSlippageTolerance)));

      expect(outputParam.traderParams.length).toEqual(1);
      expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
      expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
      expect(outputParam.traderParams[0].trader)
        .toEqual(Deployments.ARBIsolationModeWrapperTraderV4[network].address);
      expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

      expect(outputParam.makerAccounts.length).toEqual(0);
      expect(outputParam.expectedAmountOut.eq(amountIn)).toBeTruthy();
      expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
    });

    it('should work when wrapping vARB to non-ARB', async () => {
      const amountIn = new BigNumber('10000000000'); // 10,000 USDC
      const minAmountOut = new BigNumber('500000000000000000'); // 0.50 PT
      const outputParams = await zap.getSwapExactTokensForTokensParams(
        USDC_MARKET,
        amountIn,
        VOTE_ENABLED_ARB_MARKET,
        minAmountOut,
        txOrigin,
      );

      expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

      const ptWstEthMarketId = VOTE_ENABLED_ARB_MARKET.marketId;
      const outputParam = outputParams[0];
      expect(outputParam.marketIdsPath.length).toEqual(3);
      expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
      expect(outputParam.marketIdsPath[1])
        .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptWstEthMarketId.toFixed()]!.wrapperMarketIds[0]);
      expect(outputParam.marketIdsPath[2]).toEqual(ptWstEthMarketId);

      expect(outputParam.amountWeisPath.length).toEqual(3);
      expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
      expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();
      expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

      expect(outputParam.traderParams.length).toEqual(2);
      expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
      expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);

      expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
      expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
      expect(outputParam.traderParams[1].trader)
        .toEqual(Deployments.ARBIsolationModeWrapperTraderV4[network].address);
      expect(outputParam.traderParams[1].tradeData).toEqual(BYTES_EMPTY);

      expect(outputParam.makerAccounts.length).toEqual(0);
      expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
        .toBeTruthy();
      expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
    });
  });
});
