import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, MarketId, Network } from '../../src';
import {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP,
} from '../../src/lib/Constants';


export const WETH_MARKET: ApiMarket = {
  marketId: new BigNumber(0),
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
  marketId: new BigNumber(2),
  symbol: 'USDC.e',
  name: 'USD Coin',
  tokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const LINK_MARKET: ApiMarket = {
  marketId: new BigNumber(3),
  symbol: 'LINK',
  name: 'ChainLink Token',
  tokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const GLP_MARKET_ID = new BigNumber(6);
export const GLP_MARKET: ApiMarket = {
  marketId: GLP_MARKET_ID,
  symbol: 'dfsGLP',
  name: 'Dolomite: Fee + Staked GLP',
  tokenAddress: '0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

export const ARB_MARKET: ApiMarket = {
  marketId: new BigNumber(7),
  symbol: 'ARB',
  name: 'Arbitrum',
  tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const MAGIC_GLP_MARKET_ID = new BigNumber(8);
export const MAGIC_GLP_MARKET: ApiMarket = {
  marketId: MAGIC_GLP_MARKET_ID,
  symbol: 'mGLP',
  name: 'magicGLP',
  tokenAddress: '0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214',
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: {
    unwrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].unwrapper,
    outputMarketId: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].unwrapperMarketId,
    readableName: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].unwrapperReadableName,
  },
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: {
    wrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].wrapper,
    inputMarketId: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].wrapperMarketId,
    readableName: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()].wrapperReadableName,
  },
};

const PLV_GLP_MARKET_ID = new BigNumber(9);
export const PLV_GLP_MARKET: ApiMarket = {
  marketId: PLV_GLP_MARKET_ID,
  symbol: 'dplvGLP',
  name: 'Dolomite Isolation: Plutus Vault GLP',
  tokenAddress: '0x5c80aC681B6b0E7EF6E0751211012601e6cFB043',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const J_USDC_MARKET_ID = new BigNumber(10);
export const J_USDC_MARKET: ApiMarket = {
  marketId: J_USDC_MARKET_ID,
  symbol: 'djUSDC',
  name: 'Dolomite Isolation: Jones USDC',
  tokenAddress: '0x2aDba3f917bb0Af2530F8F295aD2a6fF1111Fc05',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_GLP_MARKET_ID = new BigNumber(11);
export const PT_GLP_MARKET: ApiMarket = {
  marketId: PT_GLP_MARKET_ID,
  symbol: 'dPT-GLP-28MAR2024',
  name: 'Dolomite Isolation: PT GLP 28MAR2024',
  tokenAddress: '0x7b07E78561a3C2C1Eade652A2a92Da150743F4D7',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const YT_GLP_MARKET_ID = new BigNumber(16);
export const YT_GLP_MARKET: ApiMarket = {
  marketId: YT_GLP_MARKET_ID,
  symbol: 'dYT-GLP-28MAR2024',
  name: 'Dolomite Isolation: YT GLP 28MAR2024',
  tokenAddress: '0x851729Df6C39BDB6E92721f2ADf750023D967eE8',
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_R_ETH_JUN_2025_MARKET_ID = new BigNumber(22);
export const PT_R_ETH_JUN_2025_MARKET: ApiMarket = {
  marketId: PT_R_ETH_JUN_2025_MARKET_ID,
  symbol: 'dPT-rETH-JUN2025',
  name: 'Dolomite Isolation: PT rETH JUN2025',
  tokenAddress: Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_WST_ETH_JUN_2024_MARKET_ID = new BigNumber(23);
export const PT_WST_ETH_JUN_2024_MARKET: ApiMarket = {
  marketId: PT_WST_ETH_JUN_2024_MARKET_ID,
  symbol: 'dPT-wstETH-JUN2024',
  name: 'Dolomite Isolation: PT wstETH JUN2024',
  tokenAddress: Deployments.PendlePtWstEthJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_WST_ETH_JUN_2025_MARKET_ID = new BigNumber(24);
export const PT_WST_ETH_JUN_2025_MARKET: ApiMarket = {
  marketId: PT_WST_ETH_JUN_2025_MARKET_ID,
  symbol: 'dPT-wstETH-JUN2025',
  name: 'Dolomite Isolation: PT wstETH JUN2025',
  tokenAddress: Deployments.PendlePtWstEthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketId: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketId,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

export function setUnwrapperMarketIdByMarketId(
  marketId: MarketId,
  outputMarketId: MarketId,
  network: Network = Network.ARBITRUM_ONE,
) {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperMarketId = outputMarketId;
}
