import Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ApiMarket, DolomiteZap, GenericTraderType, INTEGERS, Network } from '../src';
import { BYTES_EMPTY } from '../src/lib/Constants';
import {
  ARB_MARKET,
  GLP_MARKET,
  J_USDC_MARKET,
  MAGIC_GLP_MARKET,
  PLV_GLP_MARKET,
  setUnwrapperMarketIdByMarketId,
  USDC_MARKET,
  WETH_MARKET,
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
  const zap = new DolomiteZap(network, subgraphUrl, web3Provider, NO_CACHE);
  const validAggregatorsLength = zap.validAggregators.length;

  const allTraders = [
    Deployments.ParaswapAggregatorTraderV2[network].address,
    Deployments.OdosAggregatorTrader[network].address,
  ];

  beforeAll(async() => {
    expect(validAggregatorsLength).toBe(2);
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
          inputMarketId: new BigNumber(2),
          readableName: 'NEW Isolation Mode Wrapper',
        },
        liquidityTokenWrapperInfo: undefined,
        isolationModeUnwrapperInfo: {
          unwrapperAddress: '0x1234567812345678123456781234567812345678',
          outputMarketId: new BigNumber(2),
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

  describe('#getSwapExactTokensForTokensData', () => {
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
        const zap = new TestDolomiteZap(network, subgraphUrl, web3Provider, NO_CACHE);

        const amountIn = new BigNumber('1000000000000000000'); // 1 ETH
        const minAmountOut = new BigNumber('100000000'); // 100 USDC
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          USDC_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(zap.validAggregators.length).toBe(2);
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
          GLP_MARKET,
          amountIn,
          ARB_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
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
          GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(validAggregatorsLength);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(ARB_MARKET.marketId);
        expect(outputParam.marketIdsPath[1]).toEqual(USDC_MARKET.marketId);
        expect(outputParam.marketIdsPath[2]).toEqual(GLP_MARKET.marketId);

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
          GLP_MARKET,
          amountIn,
          PLV_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
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
          GLP_MARKET,
          amountIn,
          MAGIC_GLP_MARKET,
          minAmountOut,
          txOrigin,
        );

        expect(outputParams.length).toBe(1);

        const outputParam = outputParams[0];
        expect(outputParam.marketIdsPath.length).toEqual(3);
        expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
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
          setUnwrapperMarketIdByMarketId(GLP_MARKET.marketId, WETH_MARKET.marketId, network);

          const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            GLP_MARKET,
            amountIn,
            MAGIC_GLP_MARKET,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(validAggregatorsLength);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(4);
          expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
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
          setUnwrapperMarketIdByMarketId(GLP_MARKET.marketId, WETH_MARKET.marketId, network);

          const amountIn = new BigNumber('100000000000000000000'); // 100 GLP
          const minAmountOut = new BigNumber('50000000000000000000'); // 50 mGLP
          const outputParams = await zap.getSwapExactTokensForTokensParams(
            GLP_MARKET,
            amountIn,
            MAGIC_GLP_MARKET,
            minAmountOut,
            txOrigin,
          );

          expect(outputParams.length).toBe(validAggregatorsLength);

          const outputParam = outputParams[0];
          expect(outputParam.marketIdsPath.length).toEqual(4);
          expect(outputParam.marketIdsPath[0]).toEqual(GLP_MARKET.marketId);
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
          .toEqual(Deployments.JonesUSDCIsolationModeUnwrapperTraderV4ForLiquidation[network].address);
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
          .toEqual(Deployments.JonesUSDCIsolationModeUnwrapperTraderV4[network].address);
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
});
