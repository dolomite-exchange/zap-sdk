import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ApiMarket, Network, ZapConfig } from '../../../src';
import { GmxV2GmEstimator } from '../../../src/lib/estimators/GmxV2GmEstimator';
import { NATIVE_USDC_MARKET, WETH_MARKET } from '../../helpers/TestConstants';

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
    slippageTolerance: 0.003,
    subAccountNumber: new BigNumber('12321'),
  }

  const gmEthIsolationModeAddress = Deployments.GmxV2ETHIsolationModeVaultFactory[network]!.address;

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const gmAmountIn = new BigNumber(parseEther('100').toString());
      const ethAmount = await estimator.getUnwrappedAmount(
        gmEthIsolationModeAddress,
        gmAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );
      const usdcAmount = await estimator.getUnwrappedAmount(
        gmEthIsolationModeAddress,
        gmAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM amounts amounts out [ETH, USDC]:',
        ethAmount.amountOut.toString(),
        usdcAmount.amountOut.toString(),
      );
    });
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {
      const ethAmountIn = new BigNumber(parseEther('0.1').toString()); // 0.1 ETH
      const usdcAmountIn = new BigNumber('300000000'); // $300
      const marketAmountOutFromEth = await estimator.getWrappedAmount(
        gmEthIsolationModeAddress,
        ethAmountIn,
        WETH_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM amounts in [from ETH, from USDC]:',
        marketAmountOutFromEth.amountOut.toString(),
      );

      const marketAmountOutFromUsdc = await estimator.getWrappedAmount(
        gmEthIsolationModeAddress,
        usdcAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GM amounts in [from ETH, from USDC]:',
        marketAmountOutFromEth.amountOut.toString(),
        marketAmountOutFromUsdc.amountOut.toString(),
      );
    });
  });
});
