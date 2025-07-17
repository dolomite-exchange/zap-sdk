import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ApiMarket, DolomiteZap, GenericTraderType, Network } from '../../../src';
import { toChecksumOpt } from '../../../src/lib/Utils';
import sleep from '../../helpers/sleep';
import { SLEEP_DURATION_BETWEEN_TESTS } from '../../helpers/TestConstants';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const network = Network.BERACHAIN;
// eslint-disable-next-line max-len
const subgraphUrl = 'https://subgraph.api.dolomite.io/api/public/1301d2d1-7a9d-4be4-9e9a-061cb8611549/subgraphs/dolomite-berachain-mainnet/latest/gn';
const web3Provider = new ethers.providers.JsonRpcProvider('https://rpc.berachain.com');

describe('DolomiteZap', () => {
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
        tokenAddress: toChecksumOpt('0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111')!,
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
        tokenAddress: toChecksumOpt('0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9')!,
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
      })
    });
  });
});
