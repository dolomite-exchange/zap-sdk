import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ApiMarket, DolomiteZap, GenericTraderType, Network } from '../../../src';
import { toChecksumOpt } from '../../../src/lib/Utils';
import sleep from '../../helpers/sleep';
import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('DolomiteZap', () => {
  const network = Network.ETHEREUM;
  const subgraphUrl = 'https://api.goldsky.com/api/public/project_clyuw4gvq4d5801tegx0aafpu/subgraphs/dolomite-ethereum/v0.1.6-mainnet/gn';
  const web3Provider = new ethers.providers.JsonRpcProvider(
    'https://stylish-solitary-hill.quiknode.pro/ea06668d615e4f3492e41d8a80700dccc439eb28/',
  );
  const zap = new DolomiteZap({
    network,
    subgraphUrl,
    web3Provider,
  });
  const validAggregatorsLength = zap.validAggregators.length;

  const allTraders = [
    Deployments.OdosAggregatorTrader[network].address,
  ];

  beforeAll(async () => {
    expect(validAggregatorsLength).toBe(1);
  });

  beforeEach(async () => {
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('#getSwapExactTokensForTokensParams', () => {
    describe('Normal tokens', () => {
      const WETH_MARKET: ApiMarket = {
        marketId: new BigNumber(0),
        symbol: 'WETH',
        name: 'Wrapped Ether',
        tokenAddress: toChecksumOpt('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')!,
        decimals: 18,
        isolationModeUnwrapperInfo: undefined,
        liquidityTokenUnwrapperInfo: undefined,
        isolationModeWrapperInfo: undefined,
        liquidityTokenWrapperInfo: undefined,
      };

      const USDC_MARKET: ApiMarket = {
        marketId: new BigNumber(2),
        symbol: 'USDC',
        name: 'USD Coin',
        tokenAddress: toChecksumOpt('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')!,
        decimals: 6,
        isolationModeUnwrapperInfo: undefined,
        liquidityTokenUnwrapperInfo: undefined,
        isolationModeWrapperInfo: undefined,
        liquidityTokenWrapperInfo: undefined,
      };

      it('should work when there is no Isolation Mode tokens nor Liquidity tokens involved', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(WETH_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[0].trader)).toBeTruthy();
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});
