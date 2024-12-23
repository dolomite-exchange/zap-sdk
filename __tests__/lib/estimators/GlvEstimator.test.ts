import ModuleDeployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ApiMarket, Network, ZapConfig } from '../../../src';
import { GmxV2GmEstimator } from '../../../src/lib/estimators/GmxV2GmEstimator';
import { NATIVE_USDC_MARKET, WETH_MARKET } from '../../helpers/ArbitrumOneConstants';
import { GlvEstimator } from '../../../src/lib/estimators/GlvEstimator';

describe('GlvEstimator', () => {
  const network = Network.ARBITRUM_ONE;
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const gasMultiplier = new BigNumber(3);
  const gmxV2Estimator = new GmxV2GmEstimator(network, web3Provider, gasMultiplier);
  const estimator = new GlvEstimator(network, web3Provider, gmxV2Estimator);
  const marketsMap: Record<string, ApiMarket> = {
    [WETH_MARKET.marketId.toFixed()]: WETH_MARKET,
    [NATIVE_USDC_MARKET.marketId.toFixed()]: NATIVE_USDC_MARKET,
  };
  const config: ZapConfig = {
    gasPriceInWei: new BigNumber('17000000'), // 0.017 gwei
    blockTag: 'latest',
    filterOutZapsWithInsufficientOutput: false,
    isLiquidation: false,
    isVaporizable: false,
    slippageTolerance: 0.003,
    subAccountNumber: new BigNumber('12321'),
    disallowAggregator: false,
  }

  const glvEthIsolationModeAddress = ModuleDeployments.GlvETHIsolationModeVaultFactory['42161'].address;

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const glvAmountIn = new BigNumber(parseEther('100').toString());
      const ethAmount = await estimator.getUnwrappedAmount(
        glvEthIsolationModeAddress,
        glvAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );
      const usdcAmount = await estimator.getUnwrappedAmount(
        glvEthIsolationModeAddress,
        glvAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GLV unwrapped amounts [from ETH, from USDC]:',
        `[${ethAmount.amountOut.toString()}, ${ethAmount.extraData?.executionFee.toFixed()}]`,
        `[${usdcAmount.amountOut.toString()}, ${usdcAmount.extraData?.executionFee.toFixed()}]`,
      );
    });
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {
      const ethAmountIn = new BigNumber(parseEther('0.1').toString()); // 0.1 ETH
      const usdcAmountIn = new BigNumber('300000000'); // $300
      const glvAmountOutFromEth = await estimator.getWrappedAmount(
        glvEthIsolationModeAddress,
        ethAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );

      const glvAmountOutFromUsdc = await estimator.getWrappedAmount(
        glvEthIsolationModeAddress,
        usdcAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GLV wrapped amounts [from ETH, from USDC]:',
        `[${glvAmountOutFromEth.amountOut.toString()}, ${glvAmountOutFromEth.extraData?.executionFee.toFixed()}]`,
        `[${glvAmountOutFromUsdc.amountOut.toString()}, ${glvAmountOutFromUsdc.extraData?.executionFee.toFixed()}]`,
      );
    });
  });
});
