import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, ISOLATION_MODE_CONVERSION_MARKET_ID_MAP, Network } from '../../../src';
import Logger from '../../../src/lib/Logger';
import { POL_RUSD_MARKET, USDC_MARKET } from '../../helpers/BerachainConstants';
import sleep from '../../helpers/sleep';

import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const network = Network.BERACHAIN;
// eslint-disable-next-line max-len
const subgraphUrl = 'https://subgraph.api.dolomite.io/api/public/1301d2d1-7a9d-4be4-9e9a-061cb8611549/subgraphs/dolomite-berachain-mainnet/v0.1.4/gn';
const web3Provider = new ethers.providers.JsonRpcProvider('https://rpc.berachain.com');

describe('pol-rUSD', () => {
  const NO_CACHE = -1;
  const zap = new DolomiteZap({
    network,
    subgraphUrl,
    web3Provider,
    cacheSeconds: NO_CACHE,
    referralInfo: {
      odosReferralCode: undefined,
      oogaBoogaApiKey: process.env.OOGA_BOOGA_SECRET_KEY,
      referralAddress: undefined,
    },
  });

  beforeEach(async () => {
    // Sleep so Paraswap / Pendle does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('pol-rUSD', () => {
      it('should work when unwrapping pol-rUSD', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 pol-rUSD
        const minAmountOut = new BigNumber('90000000'); // 90 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          POL_RUSD_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

        const polRusdMarket = POL_RUSD_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(polRusdMarket);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][polRusdMarket.toFixed()]!.unwrapperMarketIds[0]);
        expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(new BigNumber(1))).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.POLrUsdIsolationModeUnwrapperUpgradeableProxy[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toEqual(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);

        Logger.info(`Unwrapping amount out: ${outputParam.expectedAmountOut.toFixed()}`);
      });

      it('should work when wrapping pol-rUSD', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('90000000000000000000'); // 90 pol-rUSD
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          POL_RUSD_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

        const ptUsdeMarketId = POL_RUSD_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptUsdeMarketId.toFixed()]!.wrapperMarketIds[0]);
        expect(outputParam.marketIdsPath[2]).toEqual(ptUsdeMarketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(1)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.POLrUsdIsolationModeWrapperUpgradeableProxy[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toEqual(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);

        Logger.info(`Wrapping amount out: ${outputParam.expectedAmountOut.toFixed()}`);
      });
    });
  });
});
