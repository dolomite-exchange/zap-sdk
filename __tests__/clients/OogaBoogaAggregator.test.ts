import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network, ZapConfig } from '../../src';
import OogaBoogaAggregator from '../../src/clients/OogaBoogaAggregator';
import { USDC_MARKET, WETH_MARKET } from '../helpers/BerachainConstants';

const oogaBoogaTraderAddress = Deployments.OogaBoogaAggregatorTrader[Network.BERACHAIN_BARTIO].address;
const secretKey = process.env.OOGA_BOOGA_SECRET_KEY!;

describe('OogaBoogaAggregator', () => {
  const networkIdOverride = Network.BERACHAIN_BARTIO;
  const config: ZapConfig = {
    slippageTolerance: 0.003,
    filterOutZapsWithInsufficientOutput: false,
    blockTag: 'latest',
    isLiquidation: false,
    isVaporizable: false,
    gasPriceInWei: undefined,
    disallowAggregator: false,
    subAccountNumber: undefined,
  }

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work normally', async () => {
      const aggregator = new OogaBoogaAggregator(networkIdOverride, secretKey);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      // @follow-up This is not returning much USDC. Testnet though so probably fine
      const minOutputAmount = new BigNumber('10000000'); // 10 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await aggregator.getSwapExactTokensForTokensData(
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
      expect(traderAddress).toEqual(oogaBoogaTraderAddress);
      expect(expectedAmountOut.gt(minOutputAmount)).toBe(true);
    });

    it('should fail when the swap does not make sense', async () => {
      const aggregator = new OogaBoogaAggregator(networkIdOverride, secretKey);
      const inputMarket: ApiMarket = {
        ...USDC_MARKET,
        tokenAddress: '0x0000000000000000000000000000000000000001',
      };
      const outputMarket: ApiMarket = WETH_MARKET;
      const inputAmount = new BigNumber('1000000'); // 1 USDC
      const minOutputAmount = new BigNumber('10000000000000000000'); // 1 ETH
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await aggregator.getSwapExactTokensForTokensData(
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
