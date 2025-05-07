import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { Network, ZapConfig } from '../../../src';
import { POLEstimator } from '../../../src/lib/estimators/POLEstimator';
import { RUSD_MARKET } from '../../helpers/BerachainConstants';

describe('POLEstimator', () => {
  const network = Network.BERACHAIN;
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const estimator = new POLEstimator(network, web3Provider);
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

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const polRUsdAmountIn = new BigNumber(parseEther('100').toString());
      const estimatorOutput = await estimator.getUnwrappedAmount(
        polRUsdAmountIn,
        new BigNumber(25), // @todo adjust once deployed
        RUSD_MARKET.marketId,
        config.isLiquidation
      );
      console.log(
        'rUsd weiAmountOut',
        estimatorOutput.amountOut.toString(),
      );
    });
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {
      const rUsdWeiAmountIn = new BigNumber(parseEther('100').toString());
      const estimatorOutput = await estimator.getWrappedAmount(
        rUsdWeiAmountIn,
        new BigNumber(25) // @todo adjust once deployed
      );
      console.log(
        'pol-rUsd output amount:',
        estimatorOutput.amountOut.toString(),
      );
    });
  });
});
