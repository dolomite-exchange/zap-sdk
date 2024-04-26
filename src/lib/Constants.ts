import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, MarketId, Network } from './ApiTypes';

export interface ApiMarketConverter {
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
  indexTokenId: MarketId;
  shortTokenId: MarketId;
  longTokenId: MarketId;
  marketTokenAddress: Address;
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const INVALID_NAME = 'INVALID';

export const BYTES_EMPTY = '0x';

// TOKENS

const WETH_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.POLYGON_ZKEVM]: new BigNumber(0),
  [Network.BASE]: new BigNumber(0),
  [Network.ARBITRUM_ONE]: new BigNumber(0),
};

const USDC_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.POLYGON_ZKEVM]: new BigNumber(2),
  [Network.BASE]: new BigNumber(2),
  [Network.ARBITRUM_ONE]: new BigNumber(2),
};

const LINK_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: new BigNumber(3),
  [Network.BASE]: new BigNumber(3),
  [Network.ARBITRUM_ONE]: new BigNumber(3),
};

const WBTC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: new BigNumber(4),
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(4),
};

const ISOLATED_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(6),
};

const ARB_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(7),
};

const MAGIC_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(8),
};

const PLV_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(9),
};

const JONES_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(10),
};

const PENDLE_PT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(11),
};

const WST_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(14),
};

const R_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(15),
};

const PENDLE_YT_GLP_MAR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(16),
};

const NATIVE_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(17),
};

const PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(22),
};

const PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(23),
};

const PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(24),
};

const ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(28),
};

const GMX_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(29),
};

const GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(30),
};

const GM_ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(31),
};

const GM_BTC_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(32),
};

const GM_ETH_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(33),
};

const GM_LINK_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(34),
};

const WE_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(35),
};

const PENDLE_PT_WE_ETH_APR_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(36),
};

const EZ_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(37),
};

const PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(38),
};

const GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(40),
};

const PENDLE_PT_GLP_SEP_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(41),
};

const PENDLE_PT_WE_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: new BigNumber(42),
};

// =========================
// ======= Addresses =======
// =========================

export const GM_MARKETS_MAP: Record<Network, Record<Address, GmMarket | undefined> | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: {
    [Deployments.GmxV2ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenId: ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenId: ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      marketTokenAddress: '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407',
    },
    [Deployments.GmxV2BTCIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenId: WBTC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      marketTokenAddress: '0x47c031236e19d024b42f8AE6780E44A573170703',
    },
    [Deployments.GmxV2ETHIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenId: WETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      marketTokenAddress: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    },
    [Deployments.GmxV2LINKIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      indexTokenId: LINK_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      longTokenId: LINK_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      shortTokenId: NATIVE_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      marketTokenAddress: '0x7f1fa204bb700853D36994DA19F830b6Ad18455C',
    },
  },
};

// OTHER ADDRESSES

export const ARBITRUM_GAS_INFO_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x000000000000000000000000000000000000006C',
};

export const EZ_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x2416092f143378750bb29b79eD961ab195CcEea5',
};

export const GMX_V2_DATA_STORE_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8',
};

export const GMX_V2_READER_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x60a0fF4cDaF0f6D496d71e0bC0fFa86FE8E6B23c',
};

const S_GLP_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
};

const R_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
};

export const WE_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
};

const WST_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: '0x5979D7b546E38E414F7E9822514be443A4800529',
};

// eslint-disable-next-line max-len
export const ISOLATION_MODE_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.POLYGON_ZKEVM]: {},
  [Network.BASE]: {},
  [Network.ARBITRUM_ONE]: {
    [ISOLATED_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.GLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PLV_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PlutusVaultGLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PlutusVaultGLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'plvGLP Isolation Mode Unwrapper',
      wrapperReadableName: 'plvGLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [JONES_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.JonesUSDCV1IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperForLiquidation:
      Deployments.JonesUSDCV1IsolationModeUnwrapperTraderV4ForLiquidation[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.JonesUSDCV1IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'jUSDC Isolation Mode Unwrapper',
      wrapperReadableName: 'jUSDC Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_GLP_MAR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtGLPMar2024IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLPMar2024IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_YT_GLP_MAR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendleYtGLPMar2024IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendleYtGLPMar2024IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'YT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'YT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtREthJun2025IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtREthJun2025IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-rETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWstEthJun2024IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2024IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWstEthJun2025IsolationModeUnwrapperTraderV5[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2025IsolationModeWrapperTraderV5[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [ARB_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.ARBIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.ARBIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'ARB Isolation Mode Unwrapper',
      wrapperReadableName: 'ARB Isolation Mode Wrapper',
      isAsync: false,
    },
    [GMX_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.GMXIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GMXIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'GMX Isolation Mode Unwrapper',
      wrapperReadableName: 'GMX Isolation Mode Wrapper',
      isAsync: false,
    },
    [GM_ARB_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
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
      unwrapperReadableName: 'GM Intent Unwrapper',
      wrapperReadableName: 'GM Intent Wrapper',
      isAsync: true,
    },
    [GM_BTC_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
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
      unwrapperReadableName: 'GM Intent Unwrapper',
      wrapperReadableName: 'GM Intent Wrapper',
      isAsync: true,
    },
    [GM_ETH_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
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
      unwrapperReadableName: 'GM Intent Unwrapper',
      wrapperReadableName: 'GM Intent Wrapper',
      isAsync: true,
    },
    [GM_LINK_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
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
      unwrapperReadableName: 'GM Intent Unwrapper',
      wrapperReadableName: 'GM Intent Wrapper',
      isAsync: true,
    },
    [PENDLE_PT_WE_ETH_APR_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWeETHApr2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHApr2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-weETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-weETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtEzETHJun2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtEzETHJun2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-ezETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-ezETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_EZ_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtEzETHJun2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtEzETHJun2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [EZ_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-ezETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-ezETH Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_GLP_SEP_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtGLPSep2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLPSep2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-GLP Isolation Mode Wrapper',
      isAsync: false,
    },
    [PENDLE_PT_WE_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWeETHJun2024IsolationModeUnwrapperTraderV3[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWeETHJun2024IsolationModeWrapperTraderV3[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      wrapperMarketIds: [WE_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!],
      unwrapperReadableName: 'PT-weETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-weETH Isolation Mode Wrapper',
      isAsync: false,
    },
  },
};

// eslint-disable-next-line max-len
export const LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.POLYGON_ZKEVM]: {},
  [Network.BASE]: {},
  [Network.ARBITRUM_ONE]: {
    [MAGIC_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.MagicGLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.MagicGLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'magicGLP Unwrapper',
      wrapperReadableName: 'magicGLP Wrapper',
      isAsync: false,
    },
    [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.GLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      wrapperMarketIds: [USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]],
      unwrapperReadableName: 'GLP Unwrapper',
      wrapperReadableName: 'GLP Wrapper',
      isAsync: false,
    },
  },
};

export const ODOS_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.BASE]: undefined,
  [Network.ARBITRUM_ONE]: Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address,
};

export const PARASWAP_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.POLYGON_ZKEVM]: Deployments.ParaswapAggregatorTraderV2[Network.POLYGON_ZKEVM].address,
  [Network.BASE]: Deployments.ParaswapAggregatorTraderV2[Network.BASE].address,
  [Network.ARBITRUM_ONE]: Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address,
};

const PT_EZ_ETH_JUN_2024_MARKET_ARBITRUM = '0x5E03C94Fc5Fb2E21882000A96Df0b63d2c4312e2';
const PT_GLP_MAR_2024_MARKET_ARBITRUM = '0x7D49E5Adc0EAAD9C027857767638613253eF125f';
const PT_GLP_SEP_2024_MARKET_ARBITRUM = '0x551c423c441db0b691b5630f04d2080caee25963';
const PT_R_ETH_2025_MARKET_ARBITRUM = '0x14FbC760eFaF36781cB0eb3Cb255aD976117B9Bd';
const PT_WST_ETH_2024_MARKET_ARBITRUM = '0xFd8AeE8FCC10aac1897F8D5271d112810C79e022';
const PT_WST_ETH_2025_MARKET_ARBITRUM = '0x08a152834de126d2ef83D612ff36e4523FD0017F';
const PT_WE_ETH_APR_2024_MARKET_ARBITRUM = '0xE11f9786B06438456b044B3E21712228ADcAA0D1';
const PT_WE_ETH_JUN_2024_MARKET_ARBITRUM = '0x952083cde7aaa11ab8449057f7de23a970aa8472';

interface PendleMarketProps {
  marketTokenAddress: string;
  transformerTokenAddress: string;
  ytTokenAddress: string;
  maturityTimestamp: number;
}

const PENDLE_PT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
  [Network.POLYGON_ZKEVM]: {},
  [Network.BASE]: {},
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendlePtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_MAR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x56051f8e46b67b4d286454995dbc6f5f3c433e34',
      maturityTimestamp: 1711584000, // 28-MAR-2024
    },
    [Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_R_ETH_2025_MARKET_ARBITRUM,
      transformerTokenAddress: R_ETH_MAP[Network.ARBITRUM_ONE]!,
      maturityTimestamp: 1750896000, // 28-JUN-2025
      ytTokenAddress: '0xe822ae44eb2466b4e263b1cbc94b4833ddef9700',
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
    [Deployments.PendlePtWeETHApr2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_APR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xf28db483773e3616da91fdfa7b5d4090ac40cc59',
      maturityTimestamp: 1714003200, // 25-APR-2024
    },
    [Deployments.PendlePtEzETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_EZ_ETH_JUN_2024_MARKET_ARBITRUM,
      transformerTokenAddress: EZ_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x05735b65686635f5c87aa9d2dae494fb2e838f38',
      maturityTimestamp: 1719446400, // 27-JUN-2024
    },
    [Deployments.PendlePtGLPSep2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_SEP_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xf875f32648BE14d04e0Df4a977Afd4290DD92713',
      maturityTimestamp: 1727308800, // 26-SEP-2024
    },
    [Deployments.PendlePtWeETHJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_WE_ETH_JUN_2024_MARKET_ARBITRUM,
      transformerTokenAddress: WE_ETH_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0xDcdC1004d5C271ADc048982d7EB900cC4F472333',
      maturityTimestamp: 1719446400, // 27-JUN-2024
    },
  },
};

const PENDLE_YT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
  [Network.POLYGON_ZKEVM]: {},
  [Network.BASE]: {},
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendleYtGLPMar2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: {
      marketTokenAddress: PT_GLP_MAR_2024_MARKET_ARBITRUM,
      transformerTokenAddress: S_GLP_MAP[Network.ARBITRUM_ONE]!,
      ytTokenAddress: '0x56051f8e46b67b4d286454995dbc6f5f3c433e34',
      maturityTimestamp: 1711584000, // 28-MAR-2024
    },
  },
};

const SIMPLE_ISOLATION_MODE_MAP: Record<Network, Record<string, boolean | undefined>> = {
  [Network.BASE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.ARBITRUM_ONE]: {
    [Deployments.ARBIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: true,
    [Deployments.GMXIsolationModeVaultFactory[Network.ARBITRUM_ONE].address]: true,
  },
}

export function isSimpleIsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  return !!SIMPLE_ISOLATION_MODE_MAP[network][tokenAddress]
}

export function isPendlePtAsset(network: Network, tokenAddress: Address): boolean {
  return !!PENDLE_PT_MARKET_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function isPendleYtAsset(network: Network, tokenAddress: Address): boolean {
  return !!PENDLE_YT_MARKET_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function isGmxV2IsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  return !!GM_MARKETS_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function getGmxV2IsolationModeAsset(network: Network, tokenAddress: Address): GmMarket | undefined {
  return GM_MARKETS_MAP[network]?.[ethers.utils.getAddress(tokenAddress)];
}

export function getGlpIsolationModeMarketId(
  network: Network,
): MarketId | undefined {
  return ISOLATED_GLP_MARKET_ID_MAP[network];
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

export function isPendlePtGlpAsset(
  network: Network,
  isolationModeToken: Address,
): boolean {
  return Deployments.PendlePtGLPMar2024IsolationModeVaultFactory[network]?.address === isolationModeToken;
}

export function isPendleYtGlpAsset(
  network: Network,
  isolationModeToken: Address,
): boolean {
  return Deployments.PendleYtGLPMar2024IsolationModeVaultFactory[network]?.address === isolationModeToken;
}
