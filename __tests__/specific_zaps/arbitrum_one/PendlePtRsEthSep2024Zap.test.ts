import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, Network } from '../../../src';

import { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP } from '../../../src/lib/MarketIds';
import { PT_RS_ETH_SEP_2024_MARKET, USDC_MARKET } from '../../helpers/ArbitrumOneConstants';
import sleep from '../../helpers/sleep';
import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('PendlePtRsEthSep2024Zap', () => {
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
  zap.setMarketsToAdd([PT_RS_ETH_SEP_2024_MARKET]);

  beforeEach(async () => {
    // Sleep so Paraswap / Pendle does not rate limit
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('Pendle PT-rsETH', () => {
      it('should work when unwrapping PT-rsETH', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 PT
        const minAmountOut = new BigNumber('100000000000'); // 100,000 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          PT_RS_ETH_SEP_2024_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

        const ptRsEthMarketId = PT_RS_ETH_SEP_2024_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ptRsEthMarketId);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptRsEthMarketId.toFixed()]!.unwrapperMarketIds[0]);
        expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(new BigNumber(1))).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendlePtRsETHSep2024IsolationModeUnwrapperTraderV3[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping PT-rsETH', async () => {
        const amountIn = new BigNumber('10000000000'); // 10,000 USDC
        const minAmountOut = new BigNumber('500000000000000000'); // 0.50 PT
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          PT_RS_ETH_SEP_2024_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBeGreaterThanOrEqual(zap.validAggregators.length);

        const ptRsEthMarketId = PT_RS_ETH_SEP_2024_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptRsEthMarketId.toFixed()]!.wrapperMarketIds[0]);
        expect(outputParam.marketIdsPath[2]).toEqual(ptRsEthMarketId);

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
          .toEqual(Deployments.PendlePtRsETHSep2024IsolationModeWrapperTraderV3[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});
