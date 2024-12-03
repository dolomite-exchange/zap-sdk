import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ApiMarket, Network, ZapConfig } from '../../../src';
import { NATIVE_USDC_MARKET, WETH_MARKET } from '../../helpers/ArbitrumOneConstants';
import { GlvEstimator } from '../../../src/lib/estimators/GlvEstimator';

describe('GlvEstimator', () => {
  const network = Network.ARBITRUM_ONE;
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const gasMultiplier = new BigNumber(3);
  const estimator = new GlvEstimator(network, web3Provider, gasMultiplier);
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
  }

  const glvEthIsolationModeAddress = '0x1230000000000000000000000000000000000321';

  describe('constructor', () => {
    it('should fail if the gas multiplier is invalid', () => {
      const invalidGasMultiplier = new BigNumber('0');
      expect(() => {
        // eslint-disable-next-line no-new
        new GlvEstimator(network, web3Provider, invalidGasMultiplier);
      }).toThrow(`Invalid gasMultiplier, expected at least 1.0, but found ${invalidGasMultiplier.toFixed()}`)
    });
  });

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
        'GLV amounts amounts out [ETH]:',
        ethAmount.amountOut.toString(),
      );
      console.log(
        'GLV amounts amounts out [USDC]:',
        usdcAmount.amountOut.toString(),
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
      console.log(
        'GLV amounts in [from ETH, from USDC]:',
        glvAmountOutFromEth.amountOut.toString(),
      );

      const glvAmountOutFromUsdc = await estimator.getWrappedAmount(
        glvEthIsolationModeAddress,
        usdcAmountIn,
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        config,
      );
      console.log(
        'GLV amounts in [from ETH, from USDC]:',
        glvAmountOutFromEth.amountOut.toString(),
        glvAmountOutFromUsdc.amountOut.toString(),
      );
    });
  });
});
