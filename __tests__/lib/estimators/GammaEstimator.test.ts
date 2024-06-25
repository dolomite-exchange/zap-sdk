import { ApiMarket, DolomiteZap, Network, ZapConfig } from '../../../src';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { GammaEstimator } from '../../../src/lib/estimators/GammaEstimator';
import { WETH_MARKET, NATIVE_USDC_MARKET } from '../../helpers/ArbitrumOneConstants';
import { GAMMA_POOLS_MAP } from '../../../src/lib/Constants';

const TEST_ADDRESS = '0x1234567890000000000000000000000000000000'
const TEST_USER_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

describe('GammaEstimator', () => {
  const network = Network.ARBITRUM_ONE;
  const subgraphUrl = process.env.SUBGRAPH_URL;
  if (!subgraphUrl) {
    throw new Error('SUBGRAPH_URL env var not set');
  }
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const zap = new DolomiteZap({
    network,
    subgraphUrl,
    web3Provider
  })
  const marketsMap: Record<string, ApiMarket> = {
    [WETH_MARKET.marketId.toFixed()]: WETH_MARKET,
    [NATIVE_USDC_MARKET.marketId.toFixed()]: NATIVE_USDC_MARKET,
  };
  GAMMA_POOLS_MAP[network]![TEST_ADDRESS] = {
    // WETH - USDC pool
    poolAddress: '0x04d24DBdd9eA6e8af5B5Eb0126797da27498DF1d',
    token0Address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',  
    token0MarketId: '0',
    token1Address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    token1MarketId: '17',
    cfmm: '0xB737586E9aB03c2Aa1e1a4f164DcEC2FE1dFbEb7',
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

  const estimator = new GammaEstimator(network, web3Provider, zap.validAggregators[0]);

  describe('#getUnwrappedAmount', () => {
    it('should work normally', async () => {
      const usdcAmount = await estimator.getUnwrappedAmount(
        TEST_ADDRESS,
        new BigNumber('10000000000000'), // .00001 LP
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        TEST_USER_ADDRESS,
        config
      );
      const wethAmount = await estimator.getUnwrappedAmount(
        TEST_ADDRESS,
        new BigNumber('10000000000000'), // .00001 LP
        WETH_MARKET.marketId,
        marketsMap,
        TEST_USER_ADDRESS,
        config
      );

      console.log(
        'USDC amount out: ',
        usdcAmount.amountOut.toString(),
      );
      console.log(
        'WETH amount out: ',
        wethAmount.amountOut.toString(),
      );
    });
  });

  describe('#getWrappedAmount', () => {
    it('should work normally', async () => {
      const wethAmount = await estimator.getWrappedAmount(
        TEST_ADDRESS,
        new BigNumber('100000000000000000'), // .1 WETH
        WETH_MARKET.marketId,
        marketsMap,
        TEST_USER_ADDRESS,
        config
      );
      const usdcAmount = await estimator.getWrappedAmount(
        TEST_ADDRESS,
        new BigNumber('100000000'), // 100 USDC
        NATIVE_USDC_MARKET.marketId,
        marketsMap,
        TEST_USER_ADDRESS,
        config
      );

      console.log(
        'Gamma amounts amounts out [USDC]:',
        usdcAmount.amountOut.toString(),
      );
      console.log(
        'Gamma amounts amounts out [WETH]:',
        wethAmount.amountOut.toString(),
      );
    });
  })
});