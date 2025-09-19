import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ApiMarket, DolomiteZap, Network, ZapConfig } from '../../src';
import OogaBoogaAggregator from '../../src/clients/OogaBoogaAggregator';
import { USDC_MARKET, WETH_MARKET } from '../helpers/BerachainConstants';

const oogaBoogaTraderAddress = Deployments.OogaBoogaAggregatorTraderV2[Network.BERACHAIN].address;
const secretKey = process.env.OOGA_BOOGA_SECRET_KEY!;

describe('OogaBoogaAggregator', () => {
  const networkIdOverride = Network.BERACHAIN;
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
  };

  describe('#getSwapExactTokensForTokensData', () => {
    it('should work normally', async () => {
      const aggregator = new OogaBoogaAggregator(networkIdOverride, secretKey);
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
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

    it('should work normally for full zap request', async () => {
      const subgraphUrl = process.env.BERACHAIN_SUBGRAPH_URL;
      if (!subgraphUrl) {
        throw new Error('SUBGRAPH_URL env var not set');
      }
      const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
      const client = new DolomiteZap({
        subgraphUrl,
        web3Provider,
        network: Network.BERACHAIN,
        referralInfo: {
          ensoApiKey: undefined,
          odosReferralCode: undefined,
          oogaBoogaApiKey: process.env.OOGA_BOOGA_SECRET_KEY!,
          referralAddress: undefined,
        },
      });
      const inputMarket: ApiMarket = WETH_MARKET;
      const outputMarket: ApiMarket = USDC_MARKET;
      const inputAmount = new BigNumber('1000000000000000000'); // 1 ETH
      const minOutputAmount = new BigNumber('10000000'); // 10 USDC
      const solidAccount = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      const aggregatorOutput = await client.getSwapExactTokensForTokensParams(
        inputMarket,
        inputAmount,
        outputMarket,
        minOutputAmount,
        solidAccount,
        config,
      );
      expect(aggregatorOutput).toBeDefined();

      const { traderParams, expectedAmountOut } = aggregatorOutput[0];
      expect(traderParams.length === 1);

      const { tradeData, trader } = traderParams[0];
      expect(tradeData).toBeDefined();
      expect(tradeData.length).toBeGreaterThanOrEqual(100);
      expect(trader).toEqual(oogaBoogaTraderAddress);
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
