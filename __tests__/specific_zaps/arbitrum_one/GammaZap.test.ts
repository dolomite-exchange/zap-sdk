import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import { ApiMarket, DolomiteZap, GenericTraderType, Network } from "../../../src";
import { ApiMarketConverter, GAMMA_POOLS_MAP, ISOLATION_MODE_CONVERSION_MARKET_ID_MAP } from "../../../src/lib/Constants";
import { NATIVE_USDC_MARKET, WETH_MARKET } from "../../helpers/ArbitrumOneConstants";
import { getApiMarket } from "../../helpers/TestConstants";
import { parseEther } from "ethers/lib/utils";

const TEST_ADDRESS = '0x1234567890000000000000000000000000000000'
const TEST_ADDRESS_UNWRAPPER =  '0x1234567890000000000000000000000000000001'
const TEST_ADDRESS_WRAPPER =  '0x1234567890000000000000000000000000000002'
const txOrigin = '0x52256ef863a713Ef349ae6E97A7E8f35785145dE';
const gammaMarketId = new BigNumber('60');

describe('GammaZap', () => {
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
    cacheSeconds: NO_CACHE,
  });

  const GAMMA_MARKET_CONVERTER: ApiMarketConverter = {
    tokenAddress: TEST_ADDRESS,
    unwrapper: TEST_ADDRESS_UNWRAPPER,
    wrapper: TEST_ADDRESS_WRAPPER,
    unwrapperMarketIds: [new BigNumber(WETH_MARKET.marketId.toFixed()), new BigNumber(NATIVE_USDC_MARKET.marketId.toFixed())],
    wrapperMarketIds: [new BigNumber(WETH_MARKET.marketId.toFixed()), new BigNumber(NATIVE_USDC_MARKET.marketId.toFixed())],
    unwrapperReadableName: 'Gamma WETH/USDC Isolation Mode Unwrapper',
    wrapperReadableName: 'Gamma WETH/USDC Isolation Mode Wrapper',
    isAsync: false
  };
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][gammaMarketId.toFixed()] = GAMMA_MARKET_CONVERTER;

  const GAMMA_MARKET: ApiMarket = getApiMarket(
    Network.ARBITRUM_ONE,
    gammaMarketId,
    'dGamma',
    'Dolomite Isolation: Gamma WETH/USDC Market',
    TEST_ADDRESS,
    18
  );
  GAMMA_POOLS_MAP[network]![TEST_ADDRESS] = {
    // WETH - USDC pool
    token0Address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',  
    token0MarketId: '0',
    token1Address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    token1MarketId: '17',
    cfmm: '0xB737586E9aB03c2Aa1e1a4f164DcEC2FE1dFbEb7',
  };

  beforeAll(async () => {
    zap.setMarketsToAdd([GAMMA_MARKET]);
  });

  describe('#getSwapExactTokensForTokensData', () => {
    describe('Gamma WETH/USDC', () => {
      it('should work when unwrapping Gamma WETH/USDC to USDC', async () => {
        const amountIn = new BigNumber(parseEther('.00001').toString()); // .00001 LP tokens
        const minAmountOut = new BigNumber('1');
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          GAMMA_MARKET,
          amountIn,
          NATIVE_USDC_MARKET,
          minAmountOut,
          txOrigin,
          { disallowAggregator: true }
        );

        expect(outputParams.length).toEqual(1);

        const outputParam0 = outputParams[0];
        expect(outputParam0.marketIdsPath.length).toEqual(2);
        expect(outputParam0.marketIdsPath[0]).toEqual(GAMMA_MARKET.marketId);
        expect(outputParam0.marketIdsPath[1]).toEqual(NATIVE_USDC_MARKET.marketId);

        expect(outputParam0.amountWeisPath.length).toEqual(2);
        expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam0.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam0.traderParams.length).toEqual(1);
        expect(outputParam0.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam0.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam0.traderParams[0].trader)
          .toEqual(TEST_ADDRESS_UNWRAPPER);
        // expect(outputParam0.traderParams[0].tradeData.length).toEqual(130);

        expect(outputParam0.makerAccounts.length).toEqual(0);
        expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when unwrapping Gamma WETH/USDC to WETH', async () => {
        const amountIn = new BigNumber(parseEther('.00001').toString()); // .00001 LP tokens
        const minAmountOut = new BigNumber('1');
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          GAMMA_MARKET,
          amountIn,
          WETH_MARKET,
          minAmountOut,
          txOrigin,
          { disallowAggregator: true }
        );

        expect(outputParams.length).toEqual(1);

        const outputParam0 = outputParams[0];
        expect(outputParam0.marketIdsPath.length).toEqual(2);
        expect(outputParam0.marketIdsPath[0]).toEqual(GAMMA_MARKET.marketId);
        expect(outputParam0.marketIdsPath[1]).toEqual(WETH_MARKET.marketId);

        expect(outputParam0.amountWeisPath.length).toEqual(2);
        expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam0.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam0.traderParams.length).toEqual(1);
        expect(outputParam0.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeUnwrapper);
        expect(outputParam0.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam0.traderParams[0].trader)
          .toEqual(TEST_ADDRESS_UNWRAPPER);
        // expect(outputParam0.traderParams[0].tradeData.length).toEqual(130);

        expect(outputParam0.makerAccounts.length).toEqual(0);
        expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping WETH to Gamma WETH/USDC', async () => {
        const amountIn = new BigNumber(parseEther('1').toString()); // 100 USDC
        const minAmountOut = new BigNumber('1');
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          WETH_MARKET,
          amountIn,
          GAMMA_MARKET,
          minAmountOut,
          txOrigin,
          { disallowAggregator: true }
        );

        expect(outputParams.length).toEqual(1);

        const outputParam0 = outputParams[0];
        expect(outputParam0.marketIdsPath.length).toEqual(2);
        expect(outputParam0.marketIdsPath[0]).toEqual(WETH_MARKET.marketId);
        expect(outputParam0.marketIdsPath[1]).toEqual(GAMMA_MARKET.marketId);

        expect(outputParam0.amountWeisPath.length).toEqual(2);
        expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam0.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam0.traderParams.length).toEqual(1);
        expect(outputParam0.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam0.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam0.traderParams[0].trader)
          .toEqual(TEST_ADDRESS_WRAPPER);
        // expect(outputParam0.traderParams[0].tradeData.length).toEqual(130);

        expect(outputParam0.makerAccounts.length).toEqual(0);
        expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);
      });

      it('should work when wrapping USDC to Gamma WETH/USDC', async () => {
        const amountIn = new BigNumber('100000000'); // 100 USDC
        const minAmountOut = new BigNumber('1');
        const outputParams = await zap.getSwapExactTokensForTokensParams(
          NATIVE_USDC_MARKET,
          amountIn,
          GAMMA_MARKET,
          minAmountOut,
          txOrigin,
          { disallowAggregator: true }
        );

        expect(outputParams.length).toEqual(1);

        const outputParam0 = outputParams[0];
        expect(outputParam0.marketIdsPath.length).toEqual(2);
        expect(outputParam0.marketIdsPath[0]).toEqual(NATIVE_USDC_MARKET.marketId);
        expect(outputParam0.marketIdsPath[1]).toEqual(GAMMA_MARKET.marketId);

        expect(outputParam0.amountWeisPath.length).toEqual(2);
        expect(outputParam0.amountWeisPath[0]).toEqual(amountIn);
        expect(outputParam0.amountWeisPath[1].isGreaterThan(minAmountOut)).toBeTruthy();

        expect(outputParam0.traderParams.length).toEqual(1);
        expect(outputParam0.traderParams[0].traderType).toEqual(GenericTraderType.IsolationModeWrapper);
        expect(outputParam0.traderParams[0].makerAccountIndex).toEqual(0);
        expect(outputParam0.traderParams[0].trader)
          .toEqual(TEST_ADDRESS_WRAPPER);
        // expect(outputParam0.traderParams[0].tradeData.length).toEqual(130);

        expect(outputParam0.makerAccounts.length).toEqual(0);
        expect(outputParam0.expectedAmountOut.gt(outputParam0.amountWeisPath[outputParam0.amountWeisPath.length - 1]))
          .toBeTruthy();
        expect(outputParam0.originalAmountOutMin).toEqual(minAmountOut);
      });
    });
  });
});