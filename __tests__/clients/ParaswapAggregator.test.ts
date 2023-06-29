import Deployments from '@dolomite-exchange/dolomite-margin-modules/scripts/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network } from '../../src';
import ParaswapAggregator from '../../src/clients/ParaswapAggregator';
import { USDC_MARKET, WETH_MARKET } from '../helpers/TestConstants';

const partnerAddress = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('ParaswapAggregator', () => {
  const networkIdOverride = Network.ARBITRUM_ONE;

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work when there is no partner address', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, undefined);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await paraswap.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is a partner address', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, partnerAddress);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await paraswap.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });
  });
});
