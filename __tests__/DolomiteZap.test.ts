import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import {
  ApiAsyncActionType,
  ApiAsyncWithdrawalStatus,
  ApiMarket,
  DolomiteZap,
  GenericTraderType,
  INTEGERS,
  Network,
} from '../src';
import { ADDRESS_ZERO, BYTES_EMPTY } from '../src/lib/Constants';
import sleep from './helpers/sleep';
import {
  ARB_MARKET,
  ISOLATED_GLP_MARKET,
  GM_ARB_MARKET,
  J_USDC_MARKET,
  MAGIC_GLP_MARKET,
  NATIVE_USDC_MARKET,
  PLV_GLP_MARKET,
  setUnwrapperMarketIdByMarketId,
  SLEEP_DURATION_BETWEEN_TESTS,
  USDC_MARKET,
  WETH_MARKET, GLP_MARKET,
} from './helpers/TestConstants';
import { TestDolomiteZap } from './helpers/TestDolomiteZap';

const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';

describe('DolomiteZap', () => {
  const network = Network.ARBITRUM_ONE;
  const subgraphUrl = process.env.SUBGRAPH_URL;
  if (!subgraphUrl) {
    throw new Error('SUBGRAPH_URL env var not set');
  }
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const NO_CACHE = -1;
  const zap = new DolomiteZap({
    network,
    subgraphUrl,
    web3Provider,
  });
  const validAggregatorsLength = zap.validAggregators.length;

  const allTraders = [
    Deployments.ParaswapAggregatorTraderV2[network].address,
    Deployments.OdosAggregatorTrader[network].address,
  ];

  beforeAll(async () => {
    zap.setMarketsToAdd([GLP_MARKET]);
    expect(validAggregatorsLength).toBe(2);
  });

  beforeEach(async () => {
    // Sleep so Paraswap does not rate limit
    setUnwrapperMarketIdByMarketId(ISOLATED_GLP_MARKET.marketId, USDC_MARKET.marketId, network);
    await sleep(SLEEP_DURATION_BETWEEN_TESTS);
  });

  describe('getters', () => {
    it('should work normally', () => {
      const cacheSeconds = NO_CACHE;
      const defaultIsLiquidation = true;
      const defaultSlippageTolerance = 0.1;
      const defaultBlockTag = 123123123;
      const useProxyServer = true;
      const gasMultiplier = new BigNumber(2.5);
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
        cacheSeconds,
        defaultIsLiquidation,
        defaultSlippageTolerance,
        defaultBlockTag,
        referralInfo: {
          referralAddress: ADDRESS_ZERO,
          odosReferralCode: new BigNumber(21231),
        },
        useProxyServer,
        gasMultiplier,
      });
      expect(testZap.subgraphUrl).toBe(subgraphUrl);
      expect(testZap.web3Provider).toBe(web3Provider);
      expect(testZap.network).toBe(network);
      expect(testZap.defaultSlippageTolerance).toBe(defaultSlippageTolerance);
      expect(testZap.defaultBlockTag).toBe(defaultBlockTag);
      expect(testZap.defaultIsLiquidation).toBe(defaultIsLiquidation);
      expect(testZap.getIsolationModeConverterByMarketId(new BigNumber(11))).toBeDefined();
      expect(testZap.getIsolationModeConverterByMarketId(new BigNumber(0))).toBeUndefined();
      expect(testZap.getLiquidityTokenConverterByMarketId(new BigNumber(8))).toBeDefined();
      expect(testZap.getLiquidityTokenConverterByMarketId(new BigNumber(0))).toBeUndefined();
    });
  });

  describe('#setDefaultSlippageTolerance', () => {
    it('should work normally', () => {
      zap.setDefaultSlippageTolerance(0.1);
      expect(zap.defaultSlippageTolerance).toEqual(0.1);

      zap.setDefaultSlippageTolerance(0.003);
      expect(zap.defaultSlippageTolerance).toEqual(0.003);
    });
  });

  describe('#setDefaultBlockTag', () => {
    it('should work normally', () => {
      zap.setDefaultBlockTag(123123);
      expect(zap.defaultBlockTag).toEqual(123123);
    });
  });

  describe('#setMarketsToAdd', () => {
    it('should work normally', () => {
      const NEW_MARKET: ApiMarket = {
        marketId: new BigNumber(9999),
        symbol: 'NEW',
        name: 'New Market',
        decimals: 18,
        tokenAddress: '0x1234567812345678123456781234567812345678',
        isolationModeWrapperInfo: undefined,
        liquidityTokenWrapperInfo: undefined,
        isolationModeUnwrapperInfo: undefined,
        liquidityTokenUnwrapperInfo: undefined,
      };
      zap.setMarketsToAdd([NEW_MARKET]);
    });

    it('should work when there is isolation mode data', () => {
      const NEW_MARKET: ApiMarket = {
        marketId: new BigNumber(9999),
        symbol: 'NEW',
        name: 'New Market',
        decimals: 18,
        tokenAddress: '0x1234567812345678123456781234567812345678',
        isolationModeWrapperInfo: {
          wrapperAddress: '0x1234567812345678123456781234567812345678',
          inputMarketIds: [new BigNumber(2)],
          readableName: 'NEW Isolation Mode Wrapper',
        },
        liquidityTokenWrapperInfo: undefined,
        isolationModeUnwrapperInfo: {
          unwrapperAddress: '0x1234567812345678123456781234567812345678',
          outputMarketIds: [new BigNumber(2)],
          readableName: 'NEW Isolation Mode Unwrapper',
        },
        liquidityTokenUnwrapperInfo: undefined,
      };
      zap.setMarketsToAdd([NEW_MARKET]);
    });

    it('should fail when isolation mode data is missing', () => {
      const NEW_MARKET: ApiMarket = {
        marketId: new BigNumber(9999),
        symbol: 'NEW',
        name: 'Dolomite Isolation: New Market',
        decimals: 18,
        tokenAddress: '0x1234567812345678123456781234567812345678',
        isolationModeWrapperInfo: undefined,
        liquidityTokenWrapperInfo: undefined,
        isolationModeUnwrapperInfo: undefined,
        liquidityTokenUnwrapperInfo: undefined,
      };
      expect(() => zap.setMarketsToAdd([NEW_MARKET])).toThrow('Missing isolation mode data for market 9999');
    });
  });

  describe('#getIsolationModeConverterByMarketId', () => {
    it('should return valid value for valid market ID', () => {
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(6))).toBeDefined();
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(9))).toBeDefined();
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(10))).toBeDefined();
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(11))).toBeDefined();
    });

    it('should return valid value for valid market ID', () => {
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(0))).toBeUndefined();
      expect(zap.getIsolationModeConverterByMarketId(new BigNumber(2))).toBeUndefined();
    });
  });

  describe('#getLiquidityTokenConverterByMarketId', () => {
    it('should return valid value for valid market ID', () => {
      expect(zap.getLiquidityTokenConverterByMarketId(new BigNumber(8))).toBeDefined();
    });

    it('should return valid value for valid market ID', () => {
      expect(zap.getLiquidityTokenConverterByMarketId(new BigNumber(0))).toBeUndefined();
      expect(zap.getLiquidityTokenConverterByMarketId(new BigNumber(2))).toBeUndefined();
    });
  });

  describe('#getSwapExactTokensForTokensParams', () => {
    describe('Normal tokens', () => {
      it('should work when there is no Isolation Mode tokens nor Liquidity tokens involved', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(WETH_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[0].trader)).toBeTruthy();
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      })

      it('should work when there is one of the aggregators returns bad data', async () => {
        const testZap = new TestDolomiteZap({
          network,
          subgraphUrl,
          web3Provider,
          cacheSeconds: NO_CACHE,
        });

        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        const outputParams = await testZap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(testZap.validAggregators.length).toBe(2);
        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(WETH_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[0].trader)).toBeTruthy();
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      })
    });

    describe('Isolation Mode tokens', () => {
      it('should work when there is an Isolation Mode token to be unwrapped and no aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
        const minAmountOut = new BigNumber('1000000'); // 1 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ISOLATED_GLP_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Isolation Mode token to be wrapped and no aggregator', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 GLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          ISOLATED_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(ISOLATED_GLP_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPIsolationModeWrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Isolation Mode token to be unwrapped and uses an aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
        const minAmountOut = new BigNumber('1000000000000000000'); // 1 ARB
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ISOLATED_GLP_MARKET,
          amountIn,
          ARB_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(ARB_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[1].trader)).toBeTruthy();
        expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Isolation Mode token to be wrapped and uses an aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 ARB
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 GLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ARB_MARKET,
          amountIn,
          ISOLATED_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ARB_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(ISOLATED_GLP_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[0].trader)).toBeTruthy();
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.GLPIsolationModeWrapperTraderV4[network].address);
        expect(outputParam.traderParams[1].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Isolation Mode token to be unwrapped into a wrapper', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 plvGLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ISOLATED_GLP_MARKET,
          amountIn,
          PLV_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(PLV_GLP_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.PlutusVaultGLPIsolationModeWrapperTraderV4[network].address);
        expect(outputParam.traderParams[1].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Isolation Mode token to be unwrapped into a Liquidity Token', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ISOLATED_GLP_MARKET,
          amountIn,
          MAGIC_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(MAGIC_GLP_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.MagicGLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it(
        'should work when there is an Isolation Mode token to be unwrapped into a wrapper and uses an aggregator',
        async () => {
          setUnwrapperMarketIdByMarketId(ISOLATED_GLP_MARKET.marketId, WETH_MARKET.marketId, network);
          await zap.forceRefreshCache();

          const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            ISOLATED_GLP_MARKET,
            amountIn,
            MAGIC_GLP_MARKET,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(validAggregatorsLength);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(4);
          expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(WETH_MARKET.marketId);
          expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);
          expect(outputParam.marketIdsPath[3]).toEqual(MAGIC_GLP_MARKET.marketId);

          const _0_025_WETH = new BigNumber('25000000000000000');
          const _50_USDC = new BigNumber('50000000');
          expect(outputParam.amountWeisPath.length).toEqual(4);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[1].isGreaterThan(_0_025_WETH)).toBeTruthy();
          expect(outputParam.amountWeisPath[2].isGreaterThan(_50_USDC)).toBeTruthy();
          expect(outputParam.amountWeisPath[3].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(3);
          expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[0].trader)
            .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
          expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

          expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
          expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
          expect(allTraders.includes(outputParam.traderParams[1].trader)).toBeTruthy();
          expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(100);

          expect(outputParam.traderParams[2].traderType).toEqual(GenericTraderType.ExternalLiquidity);
          expect(outputParam.traderParams[2].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[2].trader)
            .toEqual(Deployments.MagicGLPWrapperTraderV2[network].address);
          expect(outputParam.traderParams[2].tradeData).toEqual(BYTES_EMPTY);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
        },
      );

      it(
        'should work when there is an Isolation Mode token to be unwrapped into a Liquidity Token & uses an aggregator',
        async () => {
          setUnwrapperMarketIdByMarketId(ISOLATED_GLP_MARKET.marketId, WETH_MARKET.marketId, network);
          await zap.forceRefreshCache();

          const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            ISOLATED_GLP_MARKET,
            amountIn,
            MAGIC_GLP_MARKET,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(validAggregatorsLength);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(4);
          expect(outputParam.marketIdsPath[0]).toEqual(ISOLATED_GLP_MARKET.marketId);
          expect(outputParam.marketIdsPath[1]).toEqual(WETH_MARKET.marketId);
          expect(outputParam.marketIdsPath[2]).toEqual(USDC_MARKET.marketId);
          expect(outputParam.marketIdsPath[3]).toEqual(MAGIC_GLP_MARKET.marketId);

          const _0_025_WETH = new BigNumber('25000000000000000');
          const _50_USDC = new BigNumber('50000000');
          expect(outputParam.amountWeisPath.length).toEqual(4);
          expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
          expect(outputParam.amountWeisPath[1].isGreaterThan(_0_025_WETH)).toBeTruthy();
          expect(outputParam.amountWeisPath[2].isGreaterThan(_50_USDC)).toBeTruthy();
          expect(outputParam.amountWeisPath[3].isGreaterThan(minAmountOut)).toBeTruthy();

          expect(outputParam.traderParams.length).toEqual(3);
          expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
          expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[0].trader)
            .toEqual(Deployments.GLPIsolationModeUnwrapperTraderV4[network].address);
          expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

          expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
          expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
          expect(allTraders.includes(outputParam.traderParams[1].trader)).toBeTruthy();
          expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(100);

          expect(outputParam.traderParams[2].traderType).toEqual(GenericTraderType.ExternalLiquidity);
          expect(outputParam.traderParams[2].makerAccountIndex).toEqual(0);
          expect(outputParam.traderParams[2].trader)
            .toEqual(Deployments.MagicGLPWrapperTraderV2[network].address);
          expect(outputParam.traderParams[2].tradeData).toEqual(BYTES_EMPTY);

          expect(outputParam.makerAccounts.length).toEqual(0);
          expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
            .toBeTruthy();
          expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
        },
      );

      it('should return different unwrapper for liquidation for assets like jUSDC', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 100 jUSDC
        const minAmountOut = new BigNumber('1000000'); // 1 USDC
        const outputParamsForLiquidation = await zap.getSwapExactTokensForTokensParams(
          J_USDC_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          { isLiquidation: true },
        );

        expect(outputParamsForLiquidation.length).toBe(1);

        const outputParamForLiquidation = outputParamsForLiquidation[0];
        expect(outputParamForLiquidation.marketIdsPath.length).toEqual(2);
        expect(outputParamForLiquidation.marketIdsPath[0]).toEqual(J_USDC_MARKET.marketId);
        expect(outputParamForLiquidation.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParamForLiquidation.traderParams.length).toEqual(1);
        expect(outputParamForLiquidation.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParamForLiquidation.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParamForLiquidation.traderParams[0].trader)
          .toEqual(Deployments.JonesUSDCV1IsolationModeUnwrapperTraderV4ForLiquidation[network].address);
        expect(outputParamForLiquidation.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParamForLiquidation.makerAccounts.length).toEqual(0);
        expect(outputParamForLiquidation.expectedAmountOut
          .gt(outputParamForLiquidation.amountWeisPath[outputParamForLiquidation.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParamForLiquidation.originalAmountOutMin).toEqual(minAmountOut);

        const outputParamsForZap = await zap.getSwapExactTokensForTokensParams(
          J_USDC_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          { isLiquidation: false },
        );

        expect(outputParamsForZap.length).toBe(1);

        const outputParamForZap = outputParamsForZap[0];
        expect(outputParamForZap.marketIdsPath.length).toEqual(2);
        expect(outputParamForZap.marketIdsPath[0]).toEqual(J_USDC_MARKET.marketId);
        expect(outputParamForZap.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParamForZap.traderParams.length).toEqual(1);
        expect(outputParamForZap.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParamForZap.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParamForZap.traderParams[0].trader)
          .toEqual(Deployments.JonesUSDCV1IsolationModeUnwrapperTraderV4[network].address);
        expect(outputParamForZap.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParamForZap.makerAccounts.length).toEqual(0);
        expect(outputParamForZap.expectedAmountOut
          .gt(outputParamForZap.amountWeisPath[outputParamForZap.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParamForZap.originalAmountOutMin).toEqual(minAmountOut);
      });
    });

    describe('Liquidity Tokens', () => {
      it('should work when there is an Liquidity Token to be unwrapped and no aggregator', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 100 mGLP
        const minAmountOut = new BigNumber('1000000'); // 1 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          MAGIC_GLP_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(MAGIC_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.MagicGLPUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when GLP to be unwrapped and no aggregator', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 100 GLP
        const minAmountOut = new BigNumber('1000000'); // 1 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          GLP_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Liquidity Token to be wrapped and no aggregator', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          MAGIC_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(MAGIC_GLP_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.MagicGLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when GLP to be wrapped and no aggregator', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 GLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          USDC_MARKET,
          amountIn,
          GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(2);
        expect(outputParam.marketIdsPath[0]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(GLP_MARKET.marketId);

        expect(outputParam.amountWeisPath.length).toEqual(2);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(1);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.GLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Liquidity Token to be unwrapped and uses an aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 mGLP
        const minAmountOut = new BigNumber('1000000000000000000'); // 1 ARB
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          MAGIC_GLP_MARKET,
          amountIn,
          ARB_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(MAGIC_GLP_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(ARB_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[0].trader)
          .toEqual(Deployments.MagicGLPUnwrapperTraderV2[network].address);
        expect(outputParam.traderParams[0].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[1].trader)).toBeTruthy();
        expect(outputParam.traderParams[1].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when there is an Liquidity Token to be wrapped and uses an aggregator', async () => {
        const amountIn = new BigNumber('100000000000000000000'); // 100 ARB
        const minAmountOut = new BigNumber('50000000000000000000'); // 50 GLP
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          ARB_MARKET,
          amountIn,
          MAGIC_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ARB_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(MAGIC_GLP_MARKET.marketId);

        const _50_USDC = new BigNumber('50000000');
        expect(outputParam.amountWeisPath.length).toEqual(3);
        expect(outputParam.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam.amountWeisPath[1].isGreaterThan(_50_USDC)).toBeTruthy();
        expect(outputParam.amountWeisPath[2].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam.traderParams.length).toEqual(2);
        expect(outputParam.traderParams[0].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[0].makerAccountIndex).toEqual(0);
        expect(allTraders.includes(outputParam.traderParams[0].trader)).toBeTruthy();
        expect(outputParam.traderParams[0].tradeData.length).toBeGreaterThan(100);

        expect(outputParam.traderParams[1].traderType).toEqual(GenericTraderType.ExternalLiquidity);
        expect(outputParam.traderParams[1].makerAccountIndex).toEqual(0);
        expect(outputParam.traderParams[1].trader)
          .toEqual(Deployments.MagicGLPWrapperTraderV2[network].address);
        expect(outputParam.traderParams[1].tradeData).toEqual(BYTES_EMPTY);

        expect(outputParam.makerAccounts.length).toEqual(0);
        expect(outputParam.expectedAmountOut.gt(outputParam.amountWeisPath[outputParam.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam.originalAmountOutMin).toEqual(minAmountOut);
      });
    });

    describe('Failure cases', () => {
      it('should fail when tokenIn is not a valid Dolomite token', async () => {
        const tokenIn: ApiMarket = { ...WETH_MARKET };
        tokenIn.marketId = new BigNumber(-1);
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        await expect(
          zap.getSwapExactTokensForTokensParams(
            tokenIn,
            amountIn,
            USDC_MARKET,
            minAmountOut,
            txOrigin,
          ),
        ).rejects.toThrow(`Invalid tokenIn: ${tokenIn.symbol} / ${tokenIn.marketId}`);
      });

      it('should fail when tokenOut is not a valid Dolomite token', async () => {
        const tokenOut: ApiMarket = { ...WETH_MARKET };
        tokenOut.marketId = new BigNumber(-1);
        const amountIn = new BigNumber('10000000000'); // 10,000 USDC
        const minAmountOut = new BigNumber('100000000000000000'); // 0.001 ETH
        await expect(
          zap.getSwapExactTokensForTokensParams(
            USDC_MARKET,
            amountIn,
            tokenOut,
            minAmountOut,
            txOrigin,
          ),
        ).rejects.toThrow(`Invalid tokenOut: ${tokenOut.symbol} / ${tokenOut.marketId}`);
      });

      it('should fail when amountIn is zero', async () => {
        const minAmountOut = new BigNumber('1000000000000000000'); // 1 ETH
        await expect(
          zap.getSwapExactTokensForTokensParams(
            USDC_MARKET,
            INTEGERS.ZERO,
            WETH_MARKET,
            minAmountOut,
            txOrigin,
          ),
        ).rejects.toThrow('Invalid amountIn. Must be greater than 0');
      });

      it('should fail when amountOutMin is zero', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        await expect(zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          INTEGERS.ZERO,
          txOrigin,
        )).rejects.toThrow('Invalid amountOutMin. Must be greater than 0');
      });

      it('should fail when slippageTolerance is less than 0 or greater than 10%', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        await expect(zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          INTEGERS.ONE,
          txOrigin,
          { slippageTolerance: -1 },
        )).rejects.toThrow('Invalid slippageTolerance. Must be between 0 and 0.1 (10%)');
        await expect(zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          INTEGERS.ONE,
          txOrigin,
          { slippageTolerance: 0.11 },
        )).rejects.toThrow('Invalid slippageTolerance. Must be between 0 and 0.1 (10%)');
      });

      it('should fail when txOrigin is invalid', async () => {
        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        await expect(zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          '0x123',
        )).rejects.toThrow('Invalid address for txOrigin');
      });
    });
  });

  describe('#getSwapExactAsyncTokensForTokensParamsForLiquidation', () => {
    const amountIn = new BigNumber('100000000000000000000'); // 100 GM
    const minAmountOut = new BigNumber('50000000'); // 50 USDC

    it('should succeed normally', async () => {
      const asyncMarket = GM_ARB_MARKET;
      const key = '0x1234567812345678123456781234567812345678123456781234567812345678';
      const zapResults = await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
        asyncMarket,
        amountIn,
        USDC_MARKET,
        minAmountOut,
        txOrigin,
        {
          [NATIVE_USDC_MARKET.marketId.toFixed()]: [
            {
              key,
              id: `${asyncMarket.tokenAddress.toLowerCase()}-${key}`,
              actionType: ApiAsyncActionType.WITHDRAWAL,
              accountNumber: new BigNumber(123),
              inputToken: asyncMarket,
              inputAmount: amountIn,
              outputToken: NATIVE_USDC_MARKET,
              outputAmount: new BigNumber('100000000'), // 100 USDC
              owner: ADDRESS_ZERO,
              status: ApiAsyncWithdrawalStatus.WITHDRAWAL_EXECUTED,
            },
          ],
        },
        {
          [NATIVE_USDC_MARKET.marketId.toFixed()]: {
            oraclePrice: new BigNumber('1000000000000000000000000000000'),
          },
        },
        { isLiquidation: true },
      );

      expect(zapResults.length).toEqual(2);
    });

    it('should succeed if async output is token out', async () => {
      const asyncMarket = GM_ARB_MARKET;
      const key = '0x1234567812345678123456781234567812345678123456781234567812345678';
      const actions = [
        {
          key,
          id: `${asyncMarket.tokenAddress.toLowerCase()}-${key}`,
          actionType: ApiAsyncActionType.WITHDRAWAL,
          accountNumber: new BigNumber(123),
          inputToken: asyncMarket,
          inputAmount: amountIn,
          outputToken: NATIVE_USDC_MARKET,
          outputAmount: new BigNumber('100000000'), // 100 USDC
          owner: ADDRESS_ZERO,
          status: ApiAsyncWithdrawalStatus.WITHDRAWAL_EXECUTED,
        },
      ];
      const zapResults = await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
        asyncMarket,
        amountIn,
        NATIVE_USDC_MARKET,
        minAmountOut,
        txOrigin,
        { [NATIVE_USDC_MARKET.marketId.toFixed()]: actions },
        {
          [NATIVE_USDC_MARKET.marketId.toFixed()]: {
            oraclePrice: new BigNumber('1000000000000000000000000000000'),
          },
        },
        { isLiquidation: true },
      );

      expect(zapResults.length).toEqual(1);

      const [zapResult] = zapResults;
      expect(zapResult.marketIdsPath.length).toEqual(2);
      expect(zapResult.marketIdsPath[0]).toEqual(GM_ARB_MARKET.marketId);
      expect(zapResult.marketIdsPath[1]).toEqual(NATIVE_USDC_MARKET.marketId);

      expect(zapResult.amountWeisPath.length).toEqual(2);
      expect(zapResult.amountWeisPath[0]).toEqual(amountIn);
      expect(zapResult.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

      expect(zapResult.traderParams.length).toEqual(1);
      expect(zapResult.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
      expect(zapResult.traderParams[0].makerAccountIndex).toEqual(0);
      expect(zapResult.traderParams[0].trader)
        .toEqual(Deployments.GmxV2ARBAsyncIsolationModeUnwrapperTraderProxyV2['42161'].address);
      expect(zapResult.traderParams[0].tradeData.length).toBeGreaterThan(66);

      expect(zapResult.makerAccounts.length).toEqual(0);
      expect(zapResult.expectedAmountOut.gt(zapResult.amountWeisPath[zapResult.amountWeisPath.length - 1]))
        .toBeTruthy();
      const expectedAmountOut = actions.reduce((acc, action) => {
        return acc.plus(action.outputAmount);
      }, INTEGERS.ZERO);
      expect(zapResult.expectedAmountOut.eq(expectedAmountOut)).toBeTruthy();
      expect(zapResult.originalAmountOutMin).toEqual(minAmountOut);
    });

    it('should fail if isLiquidation is unset or false', async () => {
      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          GM_ARB_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          {},
          {},
          { isLiquidation: undefined },
        );
      }).rejects.toThrow('Config must include `isLiquidation=true`');

      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          GM_ARB_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          {},
          {},
          { isLiquidation: false },
        );
      }).rejects.toThrow('Config must include `isLiquidation=true`');
    });

    it('should fail if token in is not async', async () => {
      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          {},
          {},
          { isLiquidation: true },
        );
      }).rejects.toThrow('tokenIn must be an async asset!');
    });

    it('should fail if token out is async', async () => {
      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          GM_ARB_MARKET,
          amountIn,
          GM_ARB_MARKET,
          minAmountOut,
          txOrigin,
          {},
          {},
          { isLiquidation: true },
        );
      }).rejects.toThrow('tokenOut must not be an async asset!');
    });

    it('should fail if the marketIdToActions map is empty', async () => {
      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          GM_ARB_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          {},
          {},
          { isLiquidation: true },
        );
      }).rejects.toThrow('marketIdToActionsMap must not be empty');
    });

    it('should fail if the marketIdToActions map is empty', async () => {
      const key = '0x1234567812345678123456781234567812345678123456781234567812345678';
      await expect(async () => {
        await zap.getSwapExactAsyncTokensForTokensParamsForLiquidation(
          GM_ARB_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
          {
            [NATIVE_USDC_MARKET.marketId.toFixed()]: [
              {
                key,
                id: `${GM_ARB_MARKET.tokenAddress.toLowerCase()}-${key}`,
                actionType: ApiAsyncActionType.WITHDRAWAL,
                outputAmount: minAmountOut,
                inputAmount: amountIn,
                accountNumber: new BigNumber(123),
                inputToken: GM_ARB_MARKET,
                outputToken: NATIVE_USDC_MARKET,
                owner: ADDRESS_ZERO,
                status: ApiAsyncWithdrawalStatus.WITHDRAWAL_EXECUTED,
              },
            ],
          },
          {},
          { isLiquidation: true },
        );
      }).rejects.toThrow(`Oracle price for ${NATIVE_USDC_MARKET.marketId.toFixed()} could not be found!`);
    });
  });

  describe('#getIsAsyncAssetByMarketId', () => {
    it('should work for any GM token', async () => {
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
      });
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(31))).toBeTruthy();
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(32))).toBeTruthy();
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(33))).toBeTruthy();
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(34))).toBeTruthy();
    });

    it('should work for any non-GM token', async () => {
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
      });
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(30))).toBeFalsy();
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(35))).toBeFalsy();
      expect(testZap.getIsAsyncAssetByMarketId(new BigNumber(36))).toBeFalsy();
    });
  });

  describe('#getAsyncAssetOutputMarketsByMarketId', () => {
    it('should work for any GM token', async () => {
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
      });
      await testZap.forceRefreshCache();

      const nativeUsdcMarketId = new BigNumber(17);
      const arbMarketId = new BigNumber(7);
      const btcMarketId = new BigNumber(4);
      const ethMarketId = new BigNumber(0);
      const linkMarketId = new BigNumber(3);
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(31)))
        .toEqual([arbMarketId, nativeUsdcMarketId]);
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(32)))
        .toEqual([btcMarketId, nativeUsdcMarketId]);
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(33)))
        .toEqual([ethMarketId, nativeUsdcMarketId]);
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(34)))
        .toEqual([linkMarketId, nativeUsdcMarketId]);
    });

    it('should work for any non-GM token', async () => {
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
      });
      await testZap.forceRefreshCache();

      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(30))).toBeUndefined();
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(35))).toBeUndefined();
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(36))).toBeUndefined();
    });

    it('should default to false when the cache is empty', async () => {
      const testZap = new DolomiteZap({
        network,
        subgraphUrl,
        web3Provider,
      });

      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(31))).toBeUndefined();
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(32))).toBeUndefined();
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(33))).toBeUndefined();
      expect(testZap.getAsyncAssetOutputMarketsByMarketId(new BigNumber(34))).toBeUndefined();
    });
  });
});
