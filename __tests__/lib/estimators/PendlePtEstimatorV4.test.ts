import BigNumber from 'bignumber.js';
import { parseEther } from 'ethers/lib/utils';
import { Network } from '../../../src';
import { PT_WST_ETH_JUN_2025_MARKET, WST_ETH_MARKET } from '../../helpers/ArbitrumOneConstants';
import { PendlePtEstimatorV4 } from '../../../src/lib/estimators/PendlePtEstimatorV4';

describe('PendlePtEstimatorV4', () => {

  describe('#getUnwrappedAmount', () => {
    it('should work normally with expired market', async () => {
      const network = Network.ARBITRUM_ONE;
      const estimator = new PendlePtEstimatorV4(network);

      const ptAmountIn = new BigNumber(parseEther('100').toString());
      const tokenAmountOut = await estimator.getUnwrappedAmount(
        PT_WST_ETH_JUN_2025_MARKET.tokenAddress,
        PT_WST_ETH_JUN_2025_MARKET.isolationModeUnwrapperInfo!.unwrapperAddress,
        ptAmountIn,
        WST_ETH_MARKET.tokenAddress,
      );
      console.log(
        'PT amounts unwrapped amount [wstETH]:',
        tokenAmountOut.amountOut.toString(),
      );
    });

    it('should work normally with active market', async () => {});
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {});
  });
});
