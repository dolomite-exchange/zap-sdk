import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { DolomiteZap, GenericTraderType, INTEGERS, Network } from '../../../src';
import {
  WBTC_MARKET,
  GM_BTC_SINGLE_SIDED_MARKET,
  GM_ETH_SINGLE_SIDED_MARKET,
  WETH_MARKET,
} from '../../helpers/ArbitrumOneConstants';
import sleep from '../../helpers/sleep';
import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const GM_POOL_ASSETS_LENGTH = 1;

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
    GM_BTC_SINGLE_SIDED_MARKET,
    GM_ETH_SINGLE_SIDED_MARKET,
  ];
  const longMarkets = [
    WBTC_MARKET,
    WETH_MARKET,
  ];
  const inputAmountsForLongToken = [
    new BigNumber('0.001').multipliedBy(INTEGERS.TEN.pow(8)),
    new BigNumber('0.02').multipliedBy(INTEGERS.TEN.pow(18)),
  ];
  const minOutputAmountsForLongToken = [
    new BigNumber('0.0004').multipliedBy(INTEGERS.TEN.pow(8)),
    new BigNumber('0.004').multipliedBy(INTEGERS.TEN.pow(18)),
  ];

  beforeAll(async () => {
    zap.setMarketsToAdd(markets);
  });

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('GM BTC/ETH', () => {
      it('should work when unwrapping GM with aggregator disabled', async () => {
        for (let i = 0; i < markets.length; i += 1) {
          const market = markets[i];
          const amountIn = new BigNumber(parseEther('100').toString()); // 100 GM
          const minAmountOut = minOutputAmountsForLongToken[i];

          const outputParamsResult = await zap.getSwapExactTokensForTokensParams(
            market,
            amountIn,
            longMarkets[i],
            minAmountOut,
            txOrigin,
            { disallowAggregator: true },
          );

          expect(outputParamsResult.length).toBe(GM_POOL_ASSETS_LENGTH);

          const outputParam = outputParamsResult[0];
          expect(outputParam.marketIdsPath.length).toEqual(2);
          expect(outputParam.marketIdsPath[0]).toEqual(market.marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(longMarkets[i].marketId);

          expect(outputParam.amountWeisPath.length).toEqual(2);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(1);
          expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[0].trader)
            .toEqual(market.isolationModeUnwrapperInfo!.unwrapperAddress);
          expect(outputParam.traderParams[0].tradeData.length).toEqual(130);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);

          await sleep(SLEEP_DURATION_BETWEEN_TESTS);
        }
      });

      it('should work when wrapping GM', async () => {
        for (let i = 0; i < markets.length; i += 1) {
          const market = markets[i];
          const amountIn = inputAmountsForLongToken[i];
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 GM
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            longMarkets[i],
            amountIn,
            market,
            minAmountOut,
            txOrigin,
            { disallowAggregator: true },
          );

          expect(outputParams.length).toBe(GM_POOL_ASSETS_LENGTH);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(2);
          expect(outputParam.marketIdsPath[0]).toEqual(longMarkets[i].marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(market.marketId);

          expect(outputParam.amountWeisPath.length).toEqual(2);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(1);
          expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
          expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[0].trader)
            .toEqual(market.isolationModeWrapperInfo?.wrapperAddress);
          expect(outputParam.traderParams[0].tradeData.length).toEqual(2);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);

          await sleep(SLEEP_DURATION_BETWEEN_TESTS);
        }
      });
    });
  });
});
