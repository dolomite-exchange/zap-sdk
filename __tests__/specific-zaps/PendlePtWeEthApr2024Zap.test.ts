import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { DolomiteZap, GenericTraderType, Network } from '../../src';
import { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP } from '../../src/lib/Constants';
import { PT_WE_ETH_APR_2024_MARKET, USDC_MARKET, WE_ETH_MARKET } from '../helpers/TestConstants';
import sleep from '../helpers/sleep';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('PendlePtWeEthApr2024Zap', () => {
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
  zap.setMarketsToAdd([PT_WE_ETH_APR_2024_MARKET, WE_ETH_MARKET]);

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    await sleep(1_500);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('Pendle PT-weETH', () => {
      it('should work when unwrapping PT-weETH', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 PT
        const minAmountOut = new BigNumber('100000000000'); // 100,000 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          PT_WE_ETH_APR_2024_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(zap.validAggregators.length);

        const ptWeEthMarketId = PT_WE_ETH_APR_2024_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ptWeEthMarketId);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptWeEthMarketId.toFixed()]!.unwrapperMarketId);
        expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(new BigNumber(1))).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.PendlePtWeETHApr2024IsolationModeUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping PT-weETH', async () => {
        const amountIn = new BigNumber('10000000000'); // 10,000 USDC
        const minAmountOut = new BigNumber('500000000000000000'); // 0.50 PT
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          PT_WE_ETH_APR_2024_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(zap.validAggregators.length);

        const ptREthMarketId = PT_WE_ETH_APR_2024_MARKET.marketId;
        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1])
          .toEqual(ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][ptREthMarketId.toFixed()]!.wrapperMarketId);
        expect(outputParam.marketIdsPath[2]).toEqual(ptREthMarketId);

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
          .toEqual(Deployments.PendlePtWeETHApr2024IsolationModeWrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(66);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});
