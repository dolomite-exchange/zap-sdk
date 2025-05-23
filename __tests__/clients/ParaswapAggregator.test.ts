import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network, ZapConfig } from '../../src';
import ParaswapAggregator from '../../src/clients/ParaswapAggregator';
import { USDC_MARKET, WETH_MARKET } from '../helpers/ArbitrumOneConstants';

const partnerAddress = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('ParaswapAggregator', () => {
  const networkIdOverride = Network.ARBITRUM_ONE;
  const config: ZapConfig = {
    slippageTolerance: 0.003,
    filterOutZapsWithInsufficientOutput: false,
    blockTag: 'latest',
    isLiquidation: false,
    isVaporizable: false,
    gasPriceInWei: undefined,
    disallowAggregator: false,
    subAccountNumber: undefined,
    additionalMakerAccounts: undefined,
  }

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work when there is no partner address and uses the proxy server', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, undefined, true);
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
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is a partner address and uses the proxy server', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, partnerAddress, true);
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
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is no partner address and does not use the proxy server', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, undefined, false);
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
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should work when there is a partner address and does not use the proxy server', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, partnerAddress, false);
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
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { tradeData, traderAddress, expectedAmountOut } = aggregatorOutput!;
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(traderAddress).toEqual(Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should fail when the amount is too large', async () => {
      const paraswap = new ParaswapAggregator(networkIdOverride, partnerAddress, false);
      const inputMarket: ApiMarket = USDC_MARKET;
      const outputMarket: ApiMarket = WETH_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // a TON of USDC
      const minOutputAmount = new BigNumber('100000000'); // a SMOL amount of ETH
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await paraswap.getSwapExactTokensForTokensData(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeUndefined();
    });
  });
});
