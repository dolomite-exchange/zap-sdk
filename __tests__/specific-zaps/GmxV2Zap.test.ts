import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { DolomiteZap, GenericTraderType, Network } from '../../src';
import {
  GM_ARB_MARKET,
  GM_BTC_MARKET,
  GM_ETH_MARKET,
  GM_LINK_MARKET,
  NATIVE_USDC_MARKET, SLEEP_DURATION_BETWEEN_TESTS,
  USDC_MARKET,
} from '../helpers/TestConstants';
import sleep from '../helpers/sleep';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const subAccountNumber = new BigNumber('123');

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

  beforeAll(async () => {
    zap.setMarketsToAdd(markets);
  });

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('GM ARB/BTC/ETH/LINK', () => {
      it('should work when unwrapping GM', async () => {
        for (let i = 0; i < markets.length; i += 1) {
          const market = markets[i];
          const amountIn = new BigNumber(parseEther('100').toString()); // 100 GM
          const minAmountOut = new BigNumber('50000000'); // 50 USDC
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            market,
            amountIn,
            USDC_MARKET,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(2);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(3);
          expect(outputParam.marketIdsPath[0]).toEqual(market.marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(NATIVE_USDC_MARKET.marketId);
          expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

          expect(outputParam.amountWeisPath.length).toEqual(3);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(2);
          expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[0].trader)
            .toEqual(market.isolationModeUnwrapperInfo!.unwrapperAddress);
          expect(outputParam.traderParams[0].tradeData.length).toEqual(130);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
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
            { subAccountNumber },
          );

          expect(outputParams.length).toBe(2);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(3);
          expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(NATIVE_USDC_MARKET.marketId);
          expect(outputParam.marketIdsPath[2]).toEqual(market.marketId);

          expect(outputParam.amountWeisPath.length).toEqual(3);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(2);
          expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
          expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[1].trader)
            .toEqual(market.isolationModeWrapperInfo?.wrapperAddress);
          expect(outputParam.traderParams[1].tradeData.length).toEqual(130);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
        }
      });
    });
  });
});
