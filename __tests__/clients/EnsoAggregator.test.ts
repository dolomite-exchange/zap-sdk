// import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network, ZapConfig } from '../../src';
import { USDC_MARKET, WETH_MARKET } from '../helpers/ArbitrumOneConstants';
import EnsoAggregator from '../../src/clients/EnsoAggregator';
import { ENSO_TRADER_ADDRESS_MAP } from '../../src/lib/Constants';

const secretKey = process.env.ENSO_API_KEY!;

describe('EnsoAggregator', () => {
  const networkIdOverride = Network.ARBITRUM_ONE;
  const config: ZapConfig = {
    slippageTolerance: 0.003,
    filterOutZapsWithInsufficientOutput: false,
    blockTag: 'latest',
    isLiquidation: false,
    isVaporizable: false,
    isMaxSelected: false,
    gasPriceInWei: undefined,
    disallowAggregator: false,
    subAccountNumber: undefined,
    additionalMakerAccounts: undefined,
  }

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work normally', async () => {
      const enso = new EnsoAggregator(networkIdOverride, secretKey);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('100000000'); // 100 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await enso.getSwapExactTokensForTokensData(
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
      expect(traderAddress).toEqual(ENSO_TRADER_ADDRESS_MAP[Network.ARBITRUM_ONE]);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should fail when the swap does not make sense', async () => {
      const enso = new EnsoAggregator(networkIdOverride, secretKey);
      const inputMarket: ApiMarket = {
        ...USDC_MARKET,
        tokenAddress: '0x0000000000000000000000000000000000000001',
      };
      const outputMarket: ApiMarket = WETH_MARKET;
      const inputAmount = new BigNumber('1000000'); // 1 USDC
      const minOutputAmount = new BigNumber('10000000000000000000'); // 1 ETH
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await enso.getSwapExactTokensForTokensData(
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
