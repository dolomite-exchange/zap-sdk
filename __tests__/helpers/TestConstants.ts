import { ApiMarket, Network } from '../../src';
import {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP,
} from '../../src/lib/Constants';

export const WETH_MARKET: ApiMarket = {
  marketId: 0,
  symbol: 'WETH',
  name: 'Wrapped Ether',
  tokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const USDC_MARKET: ApiMarket = {
  marketId: 2,
  symbol: 'USDC',
  name: 'USD Coin',
  tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const LINK_MARKET: ApiMarket = {
  marketId: 3,
  symbol: 'LINK',
  name: 'ChainLink Token',
  tokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const GLP_MARKET_ID = 6;
export const GLP_MARKET: ApiMarket = {
  marketId: GLP_MARKET_ID,
  symbol: 'dfsGLP',
  name: 'Dolomite: Fee + Staked GLP',
  tokenAddress: '0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID]!.unwrapperMarketId,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID]!.wrapperMarketId,
  },
  liquidityTokenWrapperInfo: undefined,
};

export const ARB_MARKET: ApiMarket = {
  marketId: 7,
  symbol: 'ARB',
  name: 'Arbitrum',
  tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const MAGIC_GLP_MARKET_ID = 8;
export const MAGIC_GLP_MARKET: ApiMarket = {
  marketId: MAGIC_GLP_MARKET_ID,
  symbol: 'mGLP',
  name: 'magicGLP',
  tokenAddress: '0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: {
    unwrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID].unwrapper,
    outputMarketId:
    LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID].unwrapperMarketId,
  },
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: {
    wrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID].wrapper,
    inputMarketId: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID].wrapperMarketId,
  },
};

const PLV_GLP_MARKET_ID = 9;
export const PLV_GLP_MARKET: ApiMarket = {
  marketId: PLV_GLP_MARKET_ID,
  symbol: 'dplvGLP',
  name: 'Dolomite Isolation: Plutus Vault GLP',
  tokenAddress: '0x5c80aC681B6b0E7EF6E0751211012601e6cFB043',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID]!.unwrapperMarketId,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID]!.wrapperMarketId,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_GLP_MARKET_ID = 11;
export const PT_GLP_MARKET: ApiMarket = {
  marketId: PT_GLP_MARKET_ID,
  symbol: 'dPT-GLP-28MAR2024',
  name: 'Dolomite Isolation: PT GLP 28MAR2024',
  tokenAddress: '0x7b07E78561a3C2C1Eade652A2a92Da150743F4D7',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID]!.unwrapperMarketId,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID]!.wrapperMarketId,
  },
  liquidityTokenWrapperInfo: undefined,
};

export function setUnwrapperMarketIdByMarketId(
  marketId: number,
  outputMarketId: number,
  network: Network = Network.ARBITRUM_ONE,
) {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId]!.unwrapperMarketId = outputMarketId;
}
