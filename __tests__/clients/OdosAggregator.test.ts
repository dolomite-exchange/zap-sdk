import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network, ZapConfig } from '../../src';
import OdosAggregator from '../../src/clients/OdosAggregator';
import { USDC_MARKET, WETH_MARKET } from '../helpers/TestConstants';

const referralCode = new BigNumber('1064756710');

describe('OdosAggregator', () => {
  const networkIdOverride = Network.ARBITRUM_ONE;
  const config: ZapConfig = {
    slippageTolerance: 0.003,
    filterOutZapsWithInsufficientOutput: false,
    blockTag: 'latest',
    isLiquidation: false,
    isVaporizable: false,
  }

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work when there is no partner address and uses the proxy', async () => {
      const odos = new OdosAggregator(networkIdOverride, undefined, true);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await odos.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is a partner address and uses the proxy', async () => {
      const odos = new OdosAggregator(networkIdOverride, referralCode, true);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await odos.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is no partner address and does not use the proxy', async () => {
      const odos = new OdosAggregator(networkIdOverride, undefined, false);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await odos.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is a partner address and does not use the proxy', async () => {
      const odos = new OdosAggregator(networkIdOverride, referralCode, false);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await odos.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });
  });
});
