import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { DolomiteZap, GenericTraderType, INTEGERS, Network } from '../../src';
import sleep from '../helpers/sleep';
import {
  ARB_MARKET,
  GM_ARB_MARKET,
  GM_BTC_MARKET,
  GM_ETH_MARKET,
  GM_LINK_MARKET,
  LINK_MARKET,
  NATIVE_USDC_MARKET,
  SLEEP_DURATION_BETWEEN_TESTS,
  USDC_MARKET,
  WBTC_MARKET,
  WETH_MARKET,
} from '../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const GM_POOL_ASSETS_LENGTH = 2;

describe('GmxV2Zap', () => {
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
  const markets = [
    GM_ARB_MARKET,
    GM_BTC_MARKET,
    GM_ETH_MARKET,
    GM_LINK_MARKET,
  ];
  const longMarkets = [
    ARB_MARKET,
    WBTC_MARKET,
    WETH_MARKET,
    LINK_MARKET,
  ];
  const minOutputAmountsForLongToken = [
    new BigNumber('20').multipliedBy(INTEGERS.TEN.pow(18)),
    new BigNumber('0.0004').multipliedBy(INTEGERS.TEN.pow(8)),
    new BigNumber('0.004').multipliedBy(INTEGERS.TEN.pow(18)),
    new BigNumber('0.4').multipliedBy(INTEGERS.TEN.pow(18)),
  ];

  beforeAll(async () => {
    zap.setMarketsToAdd(markets);
  });

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('GM ARB/BTC/ETH/LINK', () => {
      it('should work when unwrapping GM with aggregator disabled', async () => {
        for (let i = 0; i < markets.length; i += 1) {
          const market = markets[i];
          const amountIn = new BigNumber(parseEther('100').toString()); // 100 GM
          const minAmountOut = new BigNumber('50000000'); // 50 USDC

          const outputParamsResult0 = await zap.getSwapExactTokensForTokensParams(
            market,
            amountIn,
            NATIVE_USDC_MARKET,
            minAmountOut,
            txOrigin,
            { disallowAggregator: true },
          );

          expect(outputParamsResult0.length).toBe(1);

          const outputParam0 = outputParamsResult0[0];
          expect(outputParam0.marketIdsPath.length).toEqual(2);
          expect(outputParam0.marketIdsPath[0]).toEqual(market.marketId);
          expect(outputParam0.marketIdsPath[1]).toEqual(NATIVE_USDC_MARKET.marketId);

          expect(outputParam0.amountWeisPath.length).toEqual(2);
          expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam0.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam0.traderParams.length).toEqual(1);
          expect(outputParam0.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam0.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam0.traderParams[0].trader)
            .toEqual(market.isolationModeUnwrapperInfo!.unwrapperAddress);
          expect(outputParam0.traderParams[0].tradeData.length).toEqual(130);

          expect(outputParam0.makerAccounts.length).toEqual(0);
          expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);

          await sleep(SLEEP_DURATION_BETWEEN_TESTS);

          const outputParamsResult1 = await zap.getSwapExactTokensForTokensParams(
            market,
            amountIn,
            longMarkets[i],
            minOutputAmountsForLongToken[i],
            txOrigin,
            { disallowAggregator: true },
          );

          expect(outputParamsResult1.length).toBe(1);

          const outputParam1 = outputParamsResult1[0];
          expect(outputParam1.marketIdsPath.length).toEqual(2);
          expect(outputParam1.marketIdsPath[0]).toEqual(market.marketId);
          expect(outputParam1.marketIdsPath[1]).toEqual(longMarkets[i].marketId);

          expect(outputParam1.amountWeisPath.length).toEqual(2);
          expect(outputParam1.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam1.amountWeisPath[1].isGreaterThan(minOutputAmountsForLongToken[i])).toBeTruthy();

          expect(outputParam1.traderParams.length).toEqual(1);
          expect(outputParam1.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam1.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam1.traderParams[0].trader)
            .toEqual(market.isolationModeUnwrapperInfo!.unwrapperAddress);
          expect(outputParam1.traderParams[0].tradeData.length).toEqual(130);

          expect(outputParam1.makerAccounts.length).toEqual(0);
          expect(outputParam1.expectedAmountOut.gt(outputParam1.amountWeisPath[outputParam1.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam1.originalAmountOutMin).toEqual(minOutputAmountsForLongToken[i]);
        }
      });

      it('should work when wrapping GM', async () => {
        for (let i = 0; i < markets.length; i += 1) {
          const market = markets[i];
          const amountIn = new BigNumber('100000000'); // 100 USDC
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 GM
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            USDC_MARKET,
            amountIn,
            market,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(zap.validAggregators.length * GM_POOL_ASSETS_LENGTH);

          const outputParam0 = outputParams[0];
          expect(outputParam0.marketIdsPath.length).toEqual(3);
          expect(outputParam0.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
          expect(outputParam0.marketIdsPath[2]).toEqual(market.marketId);

          expect(outputParam0.amountWeisPath.length).toEqual(3);
          expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam0.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam0.traderParams.length).toEqual(2);
          expect(outputParam0.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
          expect(outputParam0.traderParams[1].makerAccountIndex).toEqual(0);
          expect(outputParam0.traderParams[1].trader)
            .toEqual(market.isolationModeWrapperInfo?.wrapperAddress);
          expect(outputParam0.traderParams[1].tradeData.length).toEqual(2);

          expect(outputParam0.makerAccounts.length).toEqual(0);
          expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);

          const outputParam1 = outputParams[1];
          expect(outputParam1.marketIdsPath.length).toEqual(3);
          expect(outputParam1.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
          expect(outputParam1.marketIdsPath[2]).toEqual(market.marketId);

          expect(outputParam1.amountWeisPath.length).toEqual(3);
          expect(outputParam1.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam1.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam1.traderParams.length).toEqual(2);
          expect(outputParam1.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
          expect(outputParam1.traderParams[1].makerAccountIndex).toEqual(0);
          expect(outputParam1.traderParams[1].trader)
            .toEqual(market.isolationModeWrapperInfo?.wrapperAddress);
          expect(outputParam1.traderParams[1].tradeData.length).toEqual(2);

          expect(outputParam1.makerAccounts.length).toEqual(0);
          expect(outputParam1.expectedAmountOut.gt(outputParam1.amountWeisPath[outputParam1.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam1.originalAmountOutMin).toEqual(minAmountOut);

          await sleep(SLEEP_DURATION_BETWEEN_TESTS);
        }
      });
    });
  });
});
