import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, MarketId, Network } from './ApiTypes';
import { GraphqlToken } from './graphql-types';

export interface ApiMarketConverter {
  tokenAddress: Address;
  unwrapper: Address;
  unwrapperForLiquidation?: Address;
  wrapper: Address;
  unwrapperMarketIds: MarketId[];
  wrapperMarketIds: MarketId[];
  unwrapperReadableName: string;
  wrapperReadableName: string;
  isAsync: boolean;
}

export const INTEGERS = {
  NEGATIVE_ONE: new BigNumber(-1),
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  TEN: new BigNumber(10),
};

export interface GmMarket {
  indexTokenAddress: string;
  shortTokenAddress: string;
  longTokenAddress: string;
  marketTokenAddress: Address;
}

export interface GmMarketWithMarketId extends GmMarket {
  shortTokenId: MarketId | undefined;
  longTokenId: MarketId | undefined;
}

export interface GlvMarket {
  glvTokenAddress: Address;
  longTokenAddress: Address;
  longTokenId: MarketId;
  shortTokenAddress: Address;
  shortTokenId: MarketId;
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const INVALID_NAME = 'INVALID';

export const BYTES_EMPTY = '0x';

export const DOLOMITE_API_SERVER_URL = 'https://api.dolomite.io';

// LABELS

const GLV_UNWRAPPER_LABEL = 'GLV Intent Unwrapper';

const GLV_WRAPPER_LABEL = 'GLV Intent Wrapper';

const GM_UNWRAPPER_LABEL = 'GM Intent Unwrapper';

const GM_WRAPPER_LABEL = 'GM Intent Wrapper';

// TOKENS

const WETH_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.ARBITRUM_ONE]: new BigNumber(0),
  [Network.BASE]: new BigNumber(0),
  [Network.BERACHAIN]: new BigNumber(0),
  [Network.MANTLE]: new BigNumber(0),
  [Network.POLYGON_ZKEVM]: new BigNumber(0),
  [Network.X_LAYER]: new BigNumber(0),
};

const MNT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(1),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const USDC_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.ARBITRUM_ONE]: new BigNumber(2),
  [Network.BASE]: new BigNumber(2),
  [Network.BERACHAIN]: new BigNumber(2),
  [Network.MANTLE]: new BigNumber(2),
  [Network.POLYGON_ZKEVM]: new BigNumber(7),
  [Network.X_LAYER]: new BigNumber(2),
};

const LINK_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(3),
  [Network.BASE]: new BigNumber(3),
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: new BigNumber(3),
  [Network.X_LAYER]: undefined,
};

const WBTC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(4),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(3),
  [Network.POLYGON_ZKEVM]: new BigNumber(4),
  [Network.X_LAYER]: new BigNumber(3),
};

// const USDT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
//   [Network.ARBITRUM_ONE]: new BigNumber(5),
//   [Network.BASE]: undefined,
//   [Network.BERACHAIN]: undefined,
//   [Network.MANTLE]: new BigNumber(4),
//   [Network.POLYGON_ZKEVM]: new BigNumber(5),
//   [Network.X_LAYER]: new BigNumber(4),
// };

const METH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(5),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const ISOLATED_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(6),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const USDE_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(54),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(6),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const ARB_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(7),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_USDE_JUL_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(7),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const MAGIC_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(8),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PLV_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(9),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const SMNT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(9),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_USDE_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(10),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(11),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_METH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(11),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const UNI_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(12),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_MNT_OCT_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(12),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const WST_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(14),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const CM_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(14),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_CM_ETH_FEB_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: new BigNumber(15),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const R_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(15),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_YT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(16),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const NATIVE_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(17),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(21),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(22),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(23),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(24),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(28),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GMX_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(29),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(30),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(31),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_BTC_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(32),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_ETH_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(33),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_LINK_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(34),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const WE_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(35),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WE_ETH_APR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(36),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const EZ_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(37),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(38),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(40),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_GLP_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(41),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WE_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(42),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const JONES_USDC_V2_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(43),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_BTC_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(44),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_ETH_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(45),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_UNI_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(47),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const RS_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(49),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WE_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(50),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_EZ_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(51),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_RS_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(52),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_AAVE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(55),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_DOGE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(56),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(57),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_SOL_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(58),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_WST_ETH_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(59),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_WE_ETH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(60),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const PENDLE_PT_RS_ETH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(61),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_GMX_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(63),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_PENDLE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(64),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_PEPE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(65),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GM_WIF_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(66),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GLV_BTC_ISOLATED_MARKET_ID: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(67),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const GLV_ETH_ISOLATED_MARKET_ID: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(68),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

// =========================
// ======= Addresses =======
// =========================

export const GLV_MARKETS_MAP: Record<Network, Record<Address, GlvMarket | undefined> | undefined> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.GlvBTCV2IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      glvTokenAddress: '0xdF03EEd325b82bC1d4Db8b49c30ecc9E05104b96',
      longTokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      longTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
    },
    [Deployments.GlvETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      glvTokenAddress: '0x528A5bac7E746C9A509A1f4F6dF58A03d44279F9',
      longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      longTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
    },
  },
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_MARKETS_MAP: Record<Network, Record<Address, GmMarketWithMarketId | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.GmxV2AAVEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xba5DdD1f9d7F570dc94a51479a000E3BCE967196',
      longTokenId: undefined,
      longTokenAddress: '0xba5DdD1f9d7F570dc94a51479a000E3BCE967196',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x1CbBa6346F110c8A5ea739ef2d1eb182990e4EB2',
    },
    [Deployments.GmxV2ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      longTokenId: ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407',
    },
    [Deployments.GmxV2BTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x47904963fc8b2340414262125aF798B9655E58Cd',
      longTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x47c031236e19d024b42f8AE6780E44A573170703',
    },
    [Deployments.GmxV2DOGEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xC4da4c24fd591125c3F47b340b6f4f76111883d8',
      longTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4',
    },
    [Deployments.GmxV2ETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      longTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    },
    [Deployments.GmxV2GMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      longTokenId: GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x55391D178Ce46e7AC8eaAEa50A72D1A5a8A622Da',
    },
    [Deployments.GmxV2LINKIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      longTokenId: LINK_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x7f1fa204bb700853D36994DA19F830b6Ad18455C',
    },
    [Deployments.GmxV2PENDLEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
      longTokenId: PENDLE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x784292E87715d93afD7cb8C941BacaFAAA9A5102',
    },
    [Deployments.GmxV2PEPEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00',
      longTokenId: undefined,
      longTokenAddress: '0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x2b477989A149B17073D9C9C82eC9cB03591e20c6',
    },
    [Deployments.GmxV2SOLIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07',
      longTokenId: undefined,
      longTokenAddress: '0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9',
    },
    [Deployments.GmxV2UNIIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      longTokenId: UNI_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50',
    },
    [Deployments.GmxV2WIFIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xA1b91fe9FD52141Ff8cac388Ce3F10BFDc1dE79d',
      longTokenId: undefined,
      longTokenAddress: '0xA1b91fe9FD52141Ff8cac388Ce3F10BFDc1dE79d',
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      marketTokenAddress: '0x0418643F94Ef14917f1345cE5C460C37dE463ef7',
    },
    [Deployments.GmxV2WstETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      longTokenId: WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x5979D7b546E38E414F7E9822514be443A4800529',
      shortTokenId: USDE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
      marketTokenAddress: '0x0Cf1fb4d1FF67A3D8Ca92c9d6643F8F9be8e03E5',
    },
    // ==================================================
    // ============= Single Sided GM tokens =============
    // ==================================================
    [Deployments.GmxV2SingleSidedBTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x47904963fc8b2340414262125aF798B9655E58Cd',
      longTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      shortTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      marketTokenAddress: '0x7C11F78Ce78768518D743E81Fdfa2F860C6b9A77',
    },
    [Deployments.GmxV2SingleSidedETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      longTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      shortTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      marketTokenAddress: '0x450bb6774Dd8a756274E0ab4107953259d2ac541',
    },
    [Deployments.GmxV2SingleSidedGMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenAddress: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      longTokenId: GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenAddress: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      shortTokenId: GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenAddress: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
      marketTokenAddress: '0xbD48149673724f9cAeE647bb4e9D9dDaF896Efeb',
    },
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

// OTHER ADDRESSES

export const ARBITRUM_GAS_INFO_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x000000000000000000000000000000000000006C',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const CM_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: '0xe6829d9a7ee3040e1276fa75293bde931859e8fa',
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const EZ_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x2416092f143378750bb29b79eD961ab195CcEea5',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GLV_REGISTRY_PROXY_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x14F7137BAD9339c0901Df6728FF4B798F0f4429C',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GLV_READER_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x6a9505D0B44cFA863d9281EA5B0b34cB36243b45',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GMX_V2_DATA_STORE_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GMX_V2_READER_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x0537C767cDAC0726c76Bb89e92904fe28fd02fE1',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const METH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: '0xcDA86A272531e8640cD7F1a92c01839911B90bb0',
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const MULTICALL_MAP: Record<Network, Address> = {
  [Network.ARBITRUM_ONE]: '0xB18B8B1A5BDEa1f3c9776715b9325F932803FB1f',
  [Network.BASE]: '0x836b557Cf9eF29fcF49C776841191782df34e4e5',
  [Network.BERACHAIN]: '0x80dE7cB50cC6b0E1336cddE50dF78EfF413dE7fb',
  [Network.MANTLE]: '0x6978Ffdcd509dED2F8557565e0a9FC5CFA1bEbc5',
  [Network.POLYGON_ZKEVM]: '0x4232FCE0D67839F4FD536990bDc02043d9Ab708a',
  [Network.X_LAYER]: '0x86CFc6BA3bbBC603b8deC5B032aFa10A3592470D',
};

const R_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const RS_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x4186bfc76e2e237523cbc30fd220fe055156b41f',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const S_GLP_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const USDE_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34',
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const WE_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const WMNT_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

const WST_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x5979D7b546E38E414F7E9822514be443A4800529',
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

// eslint-disable-next-line max-len
export const ISOLATION_MODE_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [ISOLATED_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GLPIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PLV_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PlutusVaultGLPIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PlutusVaultGLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PlutusVaultGLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'plvGLP Isolation Mode Unwrapper',
      wrapperReadableName: 'plvGLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [JONES_USDC_V2_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.JonesUSDCV2IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.JonesUSDCV2IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperForLiquidation:
      Deployments.JonesUSDCV2IsolationModeUnwrapperTraderForLiquidationV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.JonesUSDCV2IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'jUSDC Isolation Mode Unwrapper',
      wrapperReadableName: 'jUSDC Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_GLP_MAR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtGLPMar2024IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLPMar2024IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_YT_GLP_MAR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendleYtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendleYtGLPMar2024IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendleYtGLPMar2024IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'YT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'YT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtREthJun2025IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtREthJun2025IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-rETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWstEthJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWstEthJun2024IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2024IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWstEthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWstEthJun2025IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2025IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [ARB_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.ARBIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.ARBIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'ARB Isolation Mode Unwrapper',
      wrapperReadableName: 'ARB Isolation Mode Wrapper',
      isAsync: false,
    },
    [GMX_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GMXIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GMXIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'GMX Isolation Mode Unwrapper',
      wrapperReadableName: 'GMX Isolation Mode Wrapper',
      isAsync: false,
    },
    [GM_ARB_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2ARBAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2ARBAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      wrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_BTC_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2BTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2BTCAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2BTCAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      wrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_ETH_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2ETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2ETHAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2ETHAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      ],
      wrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      ],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_LINK_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2LINKIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2LINKAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2LINKAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        LINK_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      wrapperMarketIds: [
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        LINK_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [PENDLE_PT_WE_ETH_APR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWeETHApr2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWeETHApr2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHApr2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-eETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-eETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtEzETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtEzETHJun2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtEzETHJun2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-ezETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-ezETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_GLP_SEP_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtGLPSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtGLPSep2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLPSep2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WE_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWeETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWeETHJun2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHJun2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-eETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-eETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [GM_BTC_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2SingleSidedBTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2SingleSidedBTCAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2SingleSidedBTCAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_ETH_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2SingleSidedETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2SingleSidedETHAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2SingleSidedETHAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_UNI_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2UNIIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2UNIAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2UNIAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, UNI_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, UNI_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [PENDLE_PT_WE_ETH_SEP_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWeETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWeETHSep2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHSep2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-eETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-eETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_EZ_ETH_SEP_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtEzETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtEzETHSep2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtEzETHSep2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-ezETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-ezETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_RS_ETH_SEP_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtRsETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtRsETHSep2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtRsETHSep2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [RS_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [RS_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-rsETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rsETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [GM_AAVE_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2AAVEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2AAVEAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2AAVEAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_DOGE_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2DOGEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2DOGEAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2DOGEAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_GMX_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2GMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2GMXAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2GMXAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_SOL_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2SOLIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2SOLAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2SOLAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_WST_ETH_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2WstETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2WstETHAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2WstETHAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [USDE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [PENDLE_PT_WE_ETH_DEC_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtWeETHDec2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtWeETHDec2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHDec2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-eETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-eETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_RS_ETH_DEC_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtRsETHDec2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtRsETHDec2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtRsETHDec2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [RS_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [RS_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-rsETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rsETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [GM_GMX_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2SingleSidedGMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2SingleSidedGMXAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2SingleSidedGMXAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_PENDLE_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2PENDLEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2PENDLEAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2PENDLEAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        PENDLE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      wrapperMarketIds: [PENDLE_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_PEPE_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2PEPEIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2PEPEAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2PEPEAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GM_WIF_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GmxV2WIFIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GmxV2WIFAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GmxV2WIFAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GM_UNWRAPPER_LABEL,
      wrapperReadableName: GM_WRAPPER_LABEL,
      isAsync: true,
    },
    [GLV_BTC_ISOLATED_MARKET_ID[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GlvBTCV2IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GlvBTCV2AsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GlvBTCV2AsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GLV_UNWRAPPER_LABEL,
      wrapperReadableName: GLV_WRAPPER_LABEL,
      isAsync: true,
    },
    [GLV_ETH_ISOLATED_MARKET_ID[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.GlvETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.GlvETHAsyncIsolationModeUnwrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GlvETHAsyncIsolationModeWrapperTraderProxyV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [
        WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
        NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      ],
      wrapperMarketIds: [WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!, NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: GLV_UNWRAPPER_LABEL,
      wrapperReadableName: GLV_WRAPPER_LABEL,
      isAsync: true,
    },
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {
    [PENDLE_PT_CM_ETH_FEB_2025_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtcmETHFeb2025IsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.PendlePtcmETHFeb2025IsolationModeUnwrapperTraderV3[Network.MANTLE].address,
      wrapper: Deployments.PendlePtcmETHFeb2025IsolationModeWrapperTraderV3[Network.MANTLE].address,
      unwrapperMarketIds: [CM_ETH_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [CM_ETH_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'PT-cmETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-cmETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_METH_DEC_2024_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtmETHDec2024IsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.PendlePtmETHDec2024IsolationModeUnwrapperTraderV3[Network.MANTLE].address,
      wrapper: Deployments.PendlePtmETHDec2024IsolationModeWrapperTraderV3[Network.MANTLE].address,
      unwrapperMarketIds: [METH_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [METH_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'PT-mETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-mETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_USDE_DEC_2024_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtUSDeDec2024IsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.PendlePtUSDeDec2024IsolationModeUnwrapperTraderV3[Network.MANTLE].address,
      wrapper: Deployments.PendlePtUSDeDec2024IsolationModeWrapperTraderV3[Network.MANTLE].address,
      unwrapperMarketIds: [USDE_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [USDE_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'PT-USDe Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-USDe Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_USDE_JUL_2024_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtUSDeJul2024IsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.PendlePtUSDeJul2024IsolationModeUnwrapperTraderV3[Network.MANTLE].address,
      wrapper: Deployments.PendlePtUSDeJul2024IsolationModeWrapperTraderV3[Network.MANTLE].address,
      unwrapperMarketIds: [USDE_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [USDE_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'PT-USDe Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-USDe Isolation Mode Wrapper',
      isAsync: false,
    },
    [SMNT_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.MNTIsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.MNTIsolationModeUnwrapperTraderV2[Network.MANTLE].address,
      wrapper: Deployments.MNTIsolationModeWrapperTraderV2[Network.MANTLE].address,
      unwrapperMarketIds: [MNT_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [MNT_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'sMNT Isolation Mode Unwrapper',
      wrapperReadableName: 'sMNT Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_MNT_OCT_2024_MARKET_ID_MAP[Network.MANTLE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtMntOct2024IsolationModeVaultFactory[Network.MANTLE].address,
      unwrapper: Deployments.PendlePtMntOct2024IsolationModeUnwrapperTraderV3[Network.MANTLE].address,
      wrapper: Deployments.PendlePtMntOct2024IsolationModeWrapperTraderV3[Network.MANTLE].address,
      unwrapperMarketIds: [MNT_MARKET_ID_MAP[Network.MANTLE]!],
      wrapperMarketIds: [MNT_MARKET_ID_MAP[Network.MANTLE]!],
      unwrapperReadableName: 'PT-MNT Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-MNT Isolation Mode Wrapper',
      isAsync: false,
    },
  },
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

// eslint-disable-next-line max-len
export const LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [MAGIC_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: '0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214',
      unwrapper: Deployments.MagicGLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.MagicGLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'magicGLP Unwrapper',
      wrapperReadableName: 'magicGLP Wrapper',
      isAsync: false,
    },
    [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
      unwrapper: Deployments.GLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'GLP Unwrapper',
      wrapperReadableName: 'GLP Wrapper',
      isAsync: false,
    },
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

export const ODOS_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address,
  [Network.BASE]: Deployments.OdosAggregatorTrader[Network.BASE].address,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: Deployments.OdosAggregatorTrader[Network.MANTLE].address,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const OOGA_BOOGA_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: Deployments.OogaBoogaAggregatorTrader[Network.BERACHAIN].address,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PARASWAP_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address,
  [Network.BASE]: Deployments.ParaswapAggregatorTraderV2[Network.BASE].address,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: Deployments.ParaswapAggregatorTraderV2[Network.POLYGON_ZKEVM].address,
  [Network.X_LAYER]: undefined,
};

const PT_CM_ETH_FEB_2025_MARKET_MANTLE = '0x0b923f8039ae827e963fcc1b48ab5b903d01925b';
const PT_EZ_ETH_JUN_2024_MARKET_ARBITRUM = '0x5E03C94Fc5Fb2E21882000A96Df0b63d2c4312e2';
const PT_EZ_ETH_SEP_2024_MARKET_ARBITRUM = '0x35f3db08a6e9cb4391348b0b404f493e7ae264c0';
const PT_GLP_MAR_2024_MARKET_ARBITRUM = '0x7D49E5Adc0EAAD9C027857767638613253eF125f';
const PT_GLP_SEP_2024_MARKET_ARBITRUM = '0x551c423c441db0b691b5630f04d2080caee25963';
const PT_METH_DEC_2024_MARKET_MANTLE = '0x99E83709846b6cB82d47a0D78b175E68497EA28B';
const PT_R_ETH_2025_MARKET_ARBITRUM = '0x14FbC760eFaF36781cB0eb3Cb255aD976117B9Bd';
const PT_RS_ETH_DEC_2024_MARKET_ARBITRUM = '0xcb471665bf23b2ac6196d84d947490fd5571215f';
const PT_RS_ETH_SEP_2024_MARKET_ARBITRUM = '0xed99fc8bdb8e9e7b8240f62f69609a125a0fbf14';
const PT_USDE_DEC_2024_MARKET_MANTLE = '0x2ddD4808fBB2e08b563af99B8F340433c32C8cc2';
const PT_USDE_JUL_2024_MARKET_MANTLE = '0x7dc07c575a0c512422dcab82ce9ed74db58be30c';
const PT_WE_ETH_APR_2024_MARKET_ARBITRUM = '0xE11f9786B06438456b044B3E21712228ADcAA0D1';
const PT_WE_ETH_DEC_2024_MARKET_ARBITRUM = '0x6b92feb89ed16aa971b096e247fe234db4aaa262';
const PT_WE_ETH_JUN_2024_MARKET_ARBITRUM = '0x952083cde7aaa11ab8449057f7de23a970aa8472';
const PT_WE_ETH_SEP_2024_MARKET_ARBITRUM = '0xf9f9779d8ff604732eba9ad345e6a27ef5c2a9d6';
const PT_WST_ETH_2024_MARKET_ARBITRUM = '0xFd8AeE8FCC10aac1897F8D5271d112810C79e022';
const PT_WST_ETH_2025_MARKET_ARBITRUM = '0x08a152834de126d2ef83D612ff36e4523FD0017F';

interface PendleMarketProps {
  marketTokenAddress: string;
  transformerTokenAddress: string;
  ytTokenAddress: string;
  maturityTimestamp: number;
}

const PENDLE_PT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendlePtEzETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_EZ_ETH_JUN_2024_MARKET_ARBITRUM,
      transformerTokenAddress: EZ_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x05735b65686635f5c87aa9d2dae494fb2e838f38',
      maturityTimestamp: 1719446400, // 27-JUN-2024
    },
    [Deployments.PendlePtEzETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_EZ_ETH_SEP_2024_MARKET_ARBITRUM,
      transformerTokenAddress: EZ_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x05735b65686635f5c87aa9d2dae494fb2e838f38',
      maturityTimestamp: 1727308800, // 26-SEP-2024
    },
    [Deployments.PendlePtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_MAR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x56051f8e46b67b4d286454995dbc6f5f3c433e34',
      maturityTimestamp: 1711584000, // 28-MAR-2024
    },
    [Deployments.PendlePtGLPSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_SEP_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xf875f32648BE14d04e0Df4a977Afd4290DD92713',
      maturityTimestamp: 1727308800, // 26-SEP-2024
    },
    [Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_R_ETH_2025_MARKET_ARBITRUM,
      transformerTokenAddress: R_ETH_MAP[Network.ARBITRUM_ONE]!,
      maturityTimestamp: 1750896000, // 28-JUN-2025
      ytTokenAddress: '0xe822ae44eb2466b4e263b1cbc94b4833ddef9700',
    },
    [Deployments.PendlePtRsETHDec2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_RS_ETH_DEC_2024_MARKET_ARBITRUM,
      transformerTokenAddress: RS_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x4b755c030b455b959246fc0f940de3a95f8e81ec',
      maturityTimestamp: 1735171200, // 26-DEC-2024
    },
    [Deployments.PendlePtRsETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_RS_ETH_SEP_2024_MARKET_ARBITRUM,
      transformerTokenAddress: RS_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x2fdc424946aa72d42e2f897447d7c335e64845f0',
      maturityTimestamp: 1727308800, // 26-SEP-2024
    },
    [Deployments.PendlePtWeETHApr2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_APR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xf28db483773e3616da91fdfa7b5d4090ac40cc59',
      maturityTimestamp: 1714003200, // 25-APR-2024
    },
    [Deployments.PendlePtWeETHDec2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_DEC_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x7f37674e5c6dc16b30829b7ae1e0b7fe08144b7d',
      maturityTimestamp: 1735171200, // 26-DEC-2024
    },
    [Deployments.PendlePtWeETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_JUN_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xDcdC1004d5C271ADc048982d7EB900cC4F472333',
      maturityTimestamp: 1719446400, // 27-JUN-2024
    },
    [Deployments.PendlePtWeETHSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_SEP_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xfb2a7ac0372c2425c273932f8d438518402a873e',
      maturityTimestamp: 1727308800, // 26-SEP-2024
    },
    [Deployments.PendlePtWstEthJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WST_ETH_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WST_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x0052b6096f8c1dcbefb9ba381eb6b67479b5c56b',
      maturityTimestamp: 1719446400, // 27-JUN-2024
    },
    [Deployments.PendlePtWstEthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WST_ETH_2025_MARKET_ARBITRUM,
      transformerTokenAddress: WST_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xc8d9369809e48d03ff7b69d7979b174e2d34874c',
      maturityTimestamp: 1750896000, // 28-JUN-2025
    },
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {
    [Deployments.PendlePtcmETHFeb2025IsolationModeVaultFactory[Network.MANTLE].address]: {
      marketTokenAddress: PT_CM_ETH_FEB_2025_MARKET_MANTLE,
      transformerTokenAddress: CM_ETH_MAP[Network.MANTLE]!,
      ytTokenAddress: '0x22bdbbec06611cfca7bfe3a53e9e574771851176',
      maturityTimestamp: 1739404800, // 13-FEB-2025
    },
    [Deployments.PendlePtmETHDec2024IsolationModeVaultFactory[Network.MANTLE].address]: {
      marketTokenAddress: PT_METH_DEC_2024_MARKET_MANTLE,
      transformerTokenAddress: METH_MAP[Network.MANTLE]!,
      ytTokenAddress: '0x007d35c67f97f2a898102a66df346f9e9422f7f0',
      maturityTimestamp: 1735171200, // 26-DEC-2024
    },
    [Deployments.PendlePtMntOct2024IsolationModeVaultFactory[Network.MANTLE].address]: {
      marketTokenAddress: '0x4604FC1C52cBfc38C4E6DFd2CD2a9bF5b84f65Cb',
      transformerTokenAddress: WMNT_MAP[Network.MANTLE]!,
      ytTokenAddress: '0x40ae8dbd3c41e38fe1bbc010eee40685003945a3',
      maturityTimestamp: 1727913600, // 03-OCT-2024
    },
    [Deployments.PendlePtUSDeJul2024IsolationModeVaultFactory[Network.MANTLE].address]: {
      marketTokenAddress: PT_USDE_JUL_2024_MARKET_MANTLE,
      transformerTokenAddress: USDE_MAP[Network.MANTLE]!,
      ytTokenAddress: '0xb3c0f96c4208185cc22afd1b7cf21f1dabd9648a',
      maturityTimestamp: 1721865600, // 25-JUL-2024
    },
    [Deployments.PendlePtUSDeDec2024IsolationModeVaultFactory[Network.MANTLE].address]: {
      marketTokenAddress: PT_USDE_DEC_2024_MARKET_MANTLE,
      transformerTokenAddress: USDE_MAP[Network.MANTLE]!,
      ytTokenAddress: '0xb3c0f96c4208185cc22afd1b7cf21f1dabd9648a',
      maturityTimestamp: 1735171200, // 26-DEC-2024
    },
  },
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

const PENDLE_YT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendleYtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_MAR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x56051f8e46b67b4d286454995dbc6f5f3c433e34',
      maturityTimestamp: 1711584000, // 28-MAR-2024
    },
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

const SIMPLE_ISOLATION_MODE_MAP: Record<Network, Record<string, boolean | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: true,
    [Deployments.GMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: true,
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};

export function isSimpleIsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  return !!SIMPLE_ISOLATION_MODE_MAP[network][tokenAddress];
}

export function isPendlePtAsset(network: Network, tokenAddress: Address): boolean {
  return !!PENDLE_PT_MARKET_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function isPendleYtAsset(network: Network, tokenAddress: Address): boolean {
  return !!PENDLE_YT_MARKET_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function isGlvIsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  return !!GLV_MARKETS_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function isGmxV2IsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  return !!GM_MARKETS_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function getGmxV2IsolationModeAsset(network: Network, tokenAddress: Address): GmMarketWithMarketId | undefined {
  return GM_MARKETS_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function getPendlePtMarketForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_PT_MARKET_MAP[network]?.[isolationModeToken]?.marketTokenAddress;
}

export function getPendleYtTokenForIsolationModeToken(
  network: Network,
  isolationModeTokenPtToken: Address,
): Address | undefined {
  return PENDLE_PT_MARKET_MAP[network]?.[isolationModeTokenPtToken]?.ytTokenAddress;
}

export function getPendleYtMarketForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_YT_MARKET_MAP[network]?.[isolationModeToken]?.marketTokenAddress;
}

export function getPendlePtTransformerTokenForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_PT_MARKET_MAP[network]?.[isolationModeToken]?.transformerTokenAddress;
}

export function getPendlePtMaturityTimestampForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): number | undefined {
  return PENDLE_PT_MARKET_MAP[network]?.[isolationModeToken]?.maturityTimestamp;
}

export function getPendleYtTransformerTokenForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_YT_MARKET_MAP[network]?.[isolationModeToken]?.transformerTokenAddress;
}

export function isTokenIgnored(network: Network, token: GraphqlToken): boolean {
  return network === Network.ARBITRUM_ONE && token.marketId === '10'; // jUSDC V1
}
