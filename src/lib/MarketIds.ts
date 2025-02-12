import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarketConverter, MarketId, Network } from './ApiTypes';

// LABELS

const GLV_UNWRAPPER_LABEL = 'GLV Intent Unwrapper';

const GLV_WRAPPER_LABEL = 'GLV Intent Wrapper';

const GM_UNWRAPPER_LABEL = 'GM Intent Unwrapper';

const GM_WRAPPER_LABEL = 'GM Intent Wrapper';

// MARKET IDS

export const ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(28),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const ARB_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(7),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const CM_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(14),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const EZ_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(37),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GLV_BTC_ISOLATED_MARKET_ID: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(67),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GLV_ETH_ISOLATED_MARKET_ID: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(68),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(40),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_AAVE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(55),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(31),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_BTC_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(32),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_BTC_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(44),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_DOGE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(56),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_ETH_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(33),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_ETH_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(45),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(57),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_GMX_SINGLE_SIDED_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(63),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_LINK_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(34),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_PENDLE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(64),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_PEPE_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(65),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_SOL_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(58),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_UNI_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(47),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_WIF_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(66),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GM_WST_ETH_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(59),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(30),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const GMX_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(29),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const ISOLATED_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(6),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const JONES_USDC_V2_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(43),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const LINK_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(3),
  [Network.BASE]: new BigNumber(3),
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: new BigNumber(3),
  [Network.X_LAYER]: undefined,
};

export const MAGIC_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(8),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const METH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(5),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const MNT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(1),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const NATIVE_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(17),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(21),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_CM_ETH_FEB_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(15),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(38),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_EZ_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(51),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(11),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_GLP_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(41),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_METH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(11),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_MNT_OCT_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(12),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_R_ETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(22),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_RS_ETH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(61),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_RS_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(52),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_USDE_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(10),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_USDE_JUL_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(7),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WE_ETH_APR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(36),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WE_ETH_DEC_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(60),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WE_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(42),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WE_ETH_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(50),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(23),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(24),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PENDLE_YT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(16),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const PLV_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(9),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const R_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(49),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const RS_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(49),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const SMNT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(9),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const UNI_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(12),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const USDC_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.ARBITRUM_ONE]: new BigNumber(2),
  [Network.BASE]: new BigNumber(2),
  [Network.BERACHAIN]: new BigNumber(2),
  [Network.BERACHAIN_BARTIO]: new BigNumber(2),
  [Network.MANTLE]: new BigNumber(2),
  [Network.POLYGON_ZKEVM]: new BigNumber(7),
  [Network.X_LAYER]: new BigNumber(2),
};

export const USDE_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(54),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(6),
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

// export const USDT_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
//   [Network.ARBITRUM_ONE]: new BigNumber(5),
//   [Network.BASE]: undefined,
//   [Network.BERACHAIN]: undefined,
//   [Network.BERACHAIN_BARTIO]: undefined,
//   [Network.MANTLE]: new BigNumber(4),
//   [Network.POLYGON_ZKEVM]: new BigNumber(5),
//   [Network.X_LAYER]: new BigNumber(4),
// };

export const WBTC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(4),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: new BigNumber(4),
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: new BigNumber(3),
  [Network.POLYGON_ZKEVM]: new BigNumber(4),
  [Network.X_LAYER]: new BigNumber(3),
};

export const WE_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(35),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

export const WETH_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.ARBITRUM_ONE]: new BigNumber(0),
  [Network.BASE]: new BigNumber(0),
  [Network.BERACHAIN]: new BigNumber(0),
  [Network.BERACHAIN_BARTIO]: new BigNumber(0),
  [Network.MANTLE]: new BigNumber(0),
  [Network.POLYGON_ZKEVM]: new BigNumber(0),
  [Network.X_LAYER]: new BigNumber(0),
};

export const WST_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(14),
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.BERACHAIN_BARTIO]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};

// eslint-disable-next-line max-len
export const ISOLATION_MODE_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.ARBITRUM_ONE]: {
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
    [PENDLE_PT_R_ETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      tokenAddress: Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
      unwrapper: Deployments.PendlePtREthJun2025IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtREthJun2025IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-rETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rETH Isolation Mode Wrapper',
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
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.BERACHAIN_BARTIO]: {},
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
  [Network.BERACHAIN_BARTIO]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};
