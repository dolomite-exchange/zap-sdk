import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ApiMarket, Network, ZapConfig } from '../../../src';
import { GM_MARKETS_MAP } from '../../../src/lib/Constants';
import { GmxV2GmEstimator } from '../../../src/lib/estimators/GmxV2GmEstimator';
import { NATIVE_USDC_MARKET, WETH_MARKET } from '../../helpers/ArbitrumOneConstants';

describe('GmxV2GmEstimator', () => {
  const network = Network.ARBITRUM_ONE;
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const gasMultiplier = new BigNumber(3);
  const estimator = new GmxV2GmEstimator(network, web3Provider, gasMultiplier);
  const marketsMap: Record<string, ApiMarket> = {
    [WETH_MARKET.marketId.toFixed()]: WETH_MARKET,
    [NATIVE_USDC_MARKET.marketId.toFixed()]: NATIVE_USDC_MARKET,
  };
  const config: ZapConfig = {
    gasPriceInWei: new BigNumber('100000000'), // 0.1 gwei
    blockTag: 'latest',
    filterOutZapsWithInsufficientOutput: false,
    isLiquidation: false,
    isVaporizable: false,
    slippageTolerance: 0.003,
    subAccountNumber: new BigNumber('12321'),
    disallowAggregator: false,
  };

  const gmEthMarket = GM_MARKETS_MAP[network]![Deployments.GmxV2ETHIsolationModeVaultFactory[network]!.address]!;

  describe('constructor', () => {
    it('should fail if the gas multiplier is invalid', () => {
      const invalidGasMultiplier = new BigNumber('0');
      expect(() => {
        // eslint-disable-next-line no-new
        new GmxV2GmEstimator(network, web3Provider, invalidGasMultiplier);
      }).toThrow(`Invalid gasMultiplier, expected at least 1.0, but found ${invalidGasMultiplier.toFixed()}`);
    });
  });

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const gmAmountIn = new BigNumber(parseEther('100').toString());
      const ethAmount = await estimator.getUnwrappedAmount(
        gmEthMarket,
        gmAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );
      const usdcAmount = await estimator.getUnwrappedAmount(
        gmEthMarket,
        gmAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM amounts unwrapped amount [ETH]:',
        ethAmount.amountOut.toString(),
      );
      console.log(
        'GM amounts unwrapped amount [USDC]:',
        usdcAmount.amountOut.toString(),
      );
    });
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {
      const ethAmountIn = new BigNumber(parseEther('0.1').toString()); // 0.1 ETH
      const usdcAmountIn = new BigNumber('300000000'); // $300
      const marketAmountOutFromEth = await estimator.getWrappedAmount(
        gmEthMarket,
        ethAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM wrapped amount [from ETH, from USDC]:',
        marketAmountOutFromEth.amountOut.toString(),
        marketAmountOutFromEth.extraData?.executionFee.div(parseEther('1').toString()).toFixed(6),
      );

      const marketAmountOutFromUsdc = await estimator.getWrappedAmount(
        gmEthMarket,
        usdcAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM wrapped amount [from ETH, from USDC]:',
        marketAmountOutFromUsdc.amountOut.toString(),
        marketAmountOutFromUsdc.extraData?.executionFee.div(parseEther('1').toString()).toFixed(6),
      );
    });
  });
});
