import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { Network, ZapConfig } from '../../../src';
import { ADDRESS_ZERO } from '../../../src/lib/Constants';
import { POLEstimator } from '../../../src/lib/estimators/POLEstimator';
import { POL_RUSD_MARKET } from '../../helpers/BerachainConstants';

const network = Network.BERACHAIN;
const web3Provider = new ethers.providers.JsonRpcProvider('https://rpc.berachain.com');
const estimator = new POLEstimator(network, web3Provider);

describe('POLEstimator', () => {
  const config: ZapConfig = {
    gasPriceInWei: new BigNumber('100000000'), // 0.1 gwei
    blockTag: 'latest',
    filterOutZapsWithInsufficientOutput: false,
    isLiquidation: false,
    isVaporizable: false,
    slippageTolerance: 0.003,
    subAccountNumber: new BigNumber('12321'),
    disallowAggregator: false,
    additionalMakerAccounts: [{ owner: ADDRESS_ZERO, number: 1 }],
  };

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const polRUsdAmountIn = new BigNumber(parseEther('100').toString());
      const estimatorOutput = await estimator.getUnwrappedAmount(
        polRUsdAmountIn,
        POL_RUSD_MARKET.tokenAddress,
        config.isLiquidation,
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
        POL_RUSD_MARKET.tokenAddress,
      );
      console.log(
        'pol-rUsd output amount:',
        estimatorOutput.amountOut.toString(),
      );
    });
  });
});
