/* eslint-disable max-len */
import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, MarketId, Network } from '../../src';
import {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP, WE_ETH_MAP,
} from '../../src/lib/Constants';
import { toChecksumOpt } from '../../src/lib/Utils';

export const SLEEP_DURATION_BETWEEN_TESTS = 1_000;

export const WETH_MARKET: ApiMarket = {
  marketId: new BigNumber(0),
  symbol: 'WETH',
  name: 'Wrapped Ether',
  tokenAddress: toChecksumOpt('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1')!,
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
  tokenAddress: toChecksumOpt('0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const NATIVE_USDC_MARKET: ApiMarket = {
  marketId: new BigNumber(17),
  symbol: 'USDC',
  name: 'USD Coin',
  tokenAddress: toChecksumOpt('0xaf88d065e77c8cC2239327C5EDb3A432268e5831')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const LINK_MARKET: ApiMarket = {
  marketId: new BigNumber(3),
  symbol: 'LINK',
  name: 'Chainlink Token',
  tokenAddress: toChecksumOpt('0xf97f4df75117a78c1A5a0DBb814Af92458539FB4')!,
  decimals: 8,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const WBTC_MARKET: ApiMarket = {
  marketId: new BigNumber(4),
  symbol: 'WBTC',
  name: 'Wrapped BTC',
  tokenAddress: toChecksumOpt('0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f')!,
  decimals: 8,
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
  tokenAddress: toChecksumOpt('0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

export const ARB_MARKET: ApiMarket = {
  marketId: new BigNumber(7),
  symbol: 'ARB',
  name: 'Arbitrum',
  tokenAddress: toChecksumOpt('0x912CE59144191C1204E64559FE8253a0e49E6548')!,
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
  tokenAddress: toChecksumOpt('0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: {
    unwrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: {
    wrapperAddress: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][MAGIC_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
};

const PLV_GLP_MARKET_ID = new BigNumber(9);
export const PLV_GLP_MARKET: ApiMarket = {
  marketId: PLV_GLP_MARKET_ID,
  symbol: 'dplvGLP',
  name: 'Dolomite Isolation: Plutus Vault GLP',
  tokenAddress: toChecksumOpt('0x5c80aC681B6b0E7EF6E0751211012601e6cFB043')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PLV_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const J_USDC_MARKET_ID = new BigNumber(10);
export const J_USDC_MARKET: ApiMarket = {
  marketId: J_USDC_MARKET_ID,
  symbol: 'djUSDC',
  name: 'Dolomite Isolation: Jones USDC',
  tokenAddress: toChecksumOpt('0x2aDba3f917bb0Af2530F8F295aD2a6fF1111Fc05')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][J_USDC_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_GLP_MARKET_ID = new BigNumber(11);
export const PT_GLP_MARKET: ApiMarket = {
  marketId: PT_GLP_MARKET_ID,
  symbol: 'dPT-GLP-28MAR2024',
  name: 'Dolomite Isolation: PT GLP 28MAR2024',
  tokenAddress: toChecksumOpt('0x7b07E78561a3C2C1Eade652A2a92Da150743F4D7')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const YT_GLP_MARKET_ID = new BigNumber(16);
export const YT_GLP_MARKET: ApiMarket = {
  marketId: YT_GLP_MARKET_ID,
  symbol: 'dYT-GLP-28MAR2024',
  name: 'Dolomite Isolation: YT GLP 28MAR2024',
  tokenAddress: toChecksumOpt('0x851729Df6C39BDB6E92721f2ADf750023D967eE8')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][YT_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
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
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketIds,
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
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
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
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const GM_ARB_MARKET_ID = new BigNumber(31);
export const GM_ARB_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_ARB_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GM: ARB',
  Deployments.GmxV2ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_BTC_MARKET_ID = new BigNumber(32);
export const GM_BTC_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_BTC_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GM: BTC',
  Deployments.GmxV2BTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_ETH_MARKET_ID = new BigNumber(33);
export const GM_ETH_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_ETH_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GM: ETH',
  Deployments.GmxV2ETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_LINK_MARKET_ID = new BigNumber(34);
export const GM_LINK_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_LINK_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GM: LINK',
  Deployments.GmxV2LINKIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const WE_ETH_MARKET_ID = new BigNumber(35);
export const WE_ETH_MARKET: ApiMarket = {
  marketId: WE_ETH_MARKET_ID,
  symbol: 'weETH',
  name: 'Wrapped eETH',
  tokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const PT_WE_ETH_APR_2024_MARKET_ID = new BigNumber(36);
export const PT_WE_ETH_APR_2024_MARKET: ApiMarket = {
  marketId: PT_WE_ETH_APR_2024_MARKET_ID,
  symbol: 'dPT-weETH-APR2024',
  name: 'Dolomite Isolation: PT weETH APR2024',
  tokenAddress: Deployments.PendlePtWeETHApr2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE][PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

function getApiMarket(
  network: Network,
  marketId: MarketId,
  symbol: string,
  name: string,
  tokenAddress: string,
  decimals: number,
): ApiMarket {
  return {
    marketId,
    symbol,
    name,
    tokenAddress,
    decimals,
    isolationModeUnwrapperInfo: {
      unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapper,
      outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperMarketIds,
      readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperReadableName,
    },
    liquidityTokenUnwrapperInfo: undefined,
    isolationModeWrapperInfo: {
      wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapper,
      inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapperMarketIds,
      readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapperReadableName,
    },
    liquidityTokenWrapperInfo: undefined,
  };
}

export function setUnwrapperMarketIdByMarketId(
  marketId: MarketId,
  outputMarketId: MarketId,
  network: Network = Network.ARBITRUM_ONE,
) {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperMarketIds = [outputMarketId];
}
