import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network } from '../../src';
import {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP,
  LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP,
} from '../../src/lib/MarketIds';
import { EZ_ETH_MAP, WE_ETH_MAP } from '../../src/lib/Tokens';
import { toChecksumOpt } from '../../src/lib/Utils';
import { getApiMarket } from './TestConstants';

const ARBITRUM_ISOLATION_MODE_MAP = ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE];
const ARBITRUM_LIQUIDITY_TOKEN_MAP = LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP[Network.ARBITRUM_ONE];

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

const ISOLATED_GLP_MARKET_ID = new BigNumber(6);
export const ISOLATED_GLP_MARKET: ApiMarket = {
  marketId: ISOLATED_GLP_MARKET_ID,
  symbol: 'dfsGLP',
  name: 'Dolomite: Fee + Staked GLP',
  tokenAddress: toChecksumOpt('0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[ISOLATED_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
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
    unwrapperAddress: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: {
    wrapperAddress: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_LIQUIDITY_TOKEN_MAP[MAGIC_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PLV_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const J_USDC_MARKET_ID = new BigNumber(43);
export const J_USDC_MARKET: ApiMarket = {
  marketId: J_USDC_MARKET_ID,
  symbol: 'djUSDC',
  name: 'Dolomite Isolation: Jones USDC',
  tokenAddress: toChecksumOpt('0x2aDba3f917bb0Af2530F8F295aD2a6fF1111Fc05')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[J_USDC_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const PT_GLP_MAR_2024_MARKET_ID = new BigNumber(11);
export const PT_GLP_MAR_2024_MARKET: ApiMarket = {
  marketId: PT_GLP_MAR_2024_MARKET_ID,
  symbol: 'dPT-GLP-28MAR2024',
  name: 'Dolomite Isolation: PT GLP 28MAR2024',
  tokenAddress: toChecksumOpt('0x7b07E78561a3C2C1Eade652A2a92Da150743F4D7')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_MAR_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

export const WST_ETH_MARKET: ApiMarket = {
  marketId: new BigNumber(14),
  symbol: 'wstETH',
  name: 'Wrapped Staked ETH',
  tokenAddress: toChecksumOpt('0x5979D7b546E38E414F7E9822514be443A4800529')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[YT_GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_R_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperReadableName,
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WST_ETH_JUN_2025_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const VOTE_ENABLED_ARB_MARKET_ID = new BigNumber(28);
export const VOTE_ENABLED_ARB_MARKET: ApiMarket = {
  marketId: VOTE_ENABLED_ARB_MARKET_ID,
  symbol: 'dARB',
  name: 'Dolomite Isolation: Arbitrum',
  tokenAddress: Deployments.ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[VOTE_ENABLED_ARB_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const GM_ARB_MARKET_ID = new BigNumber(31);
export const GM_ARB_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_ARB_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_BTC_MARKET_ID = new BigNumber(32);
export const GM_BTC_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_BTC_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2BTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_ETH_MARKET_ID = new BigNumber(33);
export const GM_ETH_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_ETH_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2ETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_LINK_MARKET_ID = new BigNumber(34);
export const GM_LINK_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_LINK_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
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
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_WE_ETH_APR_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const EZ_ETH_MARKET_ID = new BigNumber(37);
export const EZ_ETH_MARKET: ApiMarket = {
  marketId: EZ_ETH_MARKET_ID,
  symbol: 'ezETH',
  name: 'Renzo Restaked ETH',
  tokenAddress: EZ_ETH_MAP[Network.ARBITRUM_ONE]!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const PT_EZ_ETH_JUN_2024_MARKET_ID = new BigNumber(38);
export const PT_EZ_ETH_JUN_2024_MARKET: ApiMarket = {
  marketId: PT_EZ_ETH_JUN_2024_MARKET_ID,
  symbol: 'dPT-ezETH-JUN2024',
  name: 'Dolomite Isolation: PT ezETH JUN2024',
  tokenAddress: Deployments.PendlePtEzETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_EZ_ETH_JUN_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const GLP_MARKET_ID = new BigNumber(40);
export const GLP_MARKET: ApiMarket = {
  marketId: GLP_MARKET_ID,
  symbol: 'sGLP',
  name: 'GLP',
  tokenAddress: toChecksumOpt('0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: {
    wrapperAddress: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_LIQUIDITY_TOKEN_MAP[GLP_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
};

const PT_GLP_SEP_2024_MARKET_ID = new BigNumber(41);
export const PT_GLP_SEP_2024_MARKET: ApiMarket = {
  marketId: PT_GLP_SEP_2024_MARKET_ID,
  symbol: 'dPT-GLP-26SEP2024',
  name: 'Dolomite Isolation: PT GLP 26SEP2024',
  tokenAddress: toChecksumOpt('0x0C4D46076af67F8ba1cC3C01f7e873BD91EA41ab')!,
  decimals: 18,
  isolationModeUnwrapperInfo: {
    unwrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.unwrapper,
    outputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.unwrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.unwrapperReadableName,
  },
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: {
    wrapperAddress: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.wrapper,
    inputMarketIds: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.wrapperMarketIds,
    readableName: ARBITRUM_ISOLATION_MODE_MAP[PT_GLP_SEP_2024_MARKET_ID.toFixed()]!.wrapperReadableName,
  },
  liquidityTokenWrapperInfo: undefined,
};

const GM_BTC_SINGLE_SIDED_MARKET_ID = new BigNumber(44);
export const GM_BTC_SINGLE_SIDED_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_BTC_SINGLE_SIDED_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2SingleSidedBTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_ETH_SINGLE_SIDED_MARKET_ID = new BigNumber(45);
export const GM_ETH_SINGLE_SIDED_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_ETH_SINGLE_SIDED_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2SingleSidedETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const PT_RS_ETH_SEP_2024_MARKET_ID = new BigNumber(52);
export const PT_RS_ETH_SEP_2024_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  PT_RS_ETH_SEP_2024_MARKET_ID,
  'dPT-rsETH',
  'Dolomite Isolation: PT rsETH (SEP-26-2024)',
  Deployments.PendlePtRsETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

export const USDE_MARKET: ApiMarket = {
  marketId: new BigNumber(54),
  symbol: 'USDe',
  name: 'USDe',
  tokenAddress: toChecksumOpt('0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const GM_AAVE_MARKET_ID = new BigNumber(55);
export const GM_AAVE_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_AAVE_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2AAVEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_DOGE_MARKET_ID = new BigNumber(56);
export const GM_DOGE_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_DOGE_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2DOGEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_SOL_MARKET_ID = new BigNumber(58);
export const GM_SOL_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_SOL_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2SOLIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);

const GM_WST_ETH_MARKET_ID = new BigNumber(59);
export const GM_WST_ETH_MARKET: ApiMarket = getApiMarket(
  Network.ARBITRUM_ONE,
  GM_WST_ETH_MARKET_ID,
  'dGM',
  'Dolomite Isolation: GMX Market',
  Deployments.GmxV2WstETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  18,
);
