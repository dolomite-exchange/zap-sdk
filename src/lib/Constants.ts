import * as Deployments from '@dolomite-exchange/dolomite-margin-modules/scripts/deployments.json';
import BigNumber from 'bignumber.js';
import { Address, MarketId, Network } from './ApiTypes';

export interface ApiMarketConverter {
  unwrapper: Address;
  unwrapperForLiquidation?: Address;
  wrapper: Address;
  unwrapperMarketId: MarketId;
  wrapperMarketId: MarketId;
  unwrapperReadableName: string;
  wrapperReadableName: string;
}

export const INTEGERS = {
  NEGATIVE_ONE: new BigNumber(-1),
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
};

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const INVALID_NAME = 'INVALID';

export const BYTES_EMPTY = '0x';

const USDC_MARKET_ID_MAP: Record<Network, MarketId> = {
  [Network.ARBITRUM_ONE]: new BigNumber(2),
  [Network.ARBITRUM_GOERLI]: new BigNumber(2),
};

const ATLAS_PTSI_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: undefined,
  [Network.ARBITRUM_GOERLI]: new BigNumber(5),
};

const GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(6),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const ARB_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(7),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const MAGIC_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(8),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PLV_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(9),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const JONES_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(10),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_PT_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(11),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const WST_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(14),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const R_ETH_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(15),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_YT_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(16),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(22),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(23),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(24),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const ARB_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(28),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const GMX_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(29),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const GMX_ISOLATED_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: new BigNumber(30),
  [Network.ARBITRUM_GOERLI]: undefined,
};

const GLP_ISOLATION_MODE_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.GLPIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  [Network.ARBITRUM_GOERLI]: undefined,
};

// eslint-disable-next-line max-len
export const ISOLATION_MODE_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.GLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'GLP Isolation Mode Wrapper',
    },
    [PLV_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PlutusVaultGLPIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PlutusVaultGLPIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'plvGLP Isolation Mode Unwrapper',
      wrapperReadableName: 'plvGLP Isolation Mode Wrapper',
    },
    [JONES_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.JonesUSDCIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperForLiquidation:
      Deployments.JonesUSDCIsolationModeUnwrapperTraderV4ForLiquidation[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.JonesUSDCIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'jUSDC Isolation Mode Unwrapper',
      wrapperReadableName: 'jUSDC Isolation Mode Wrapper',
    },
    [PENDLE_PT_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtGLP2024IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLP2024IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'PT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-GLP Isolation Mode Wrapper',
    },
    [PENDLE_YT_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendleYtGLP2024IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendleYtGLP2024IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'YT-GLP Isolation Mode Unwrapper',
      wrapperReadableName: 'YT-GLP Isolation Mode Wrapper',
    },
    [PENDLE_PT_RETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtREthJun2025IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtREthJun2025IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      wrapperMarketId: R_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      unwrapperReadableName: 'PT-rETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-rETH Isolation Mode Wrapper',
    },
    [PENDLE_PT_WST_ETH_JUN_2024_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWstEthJun2024IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2024IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      wrapperMarketId: WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
    },
    [PENDLE_PT_WST_ETH_JUN_2025_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.PendlePtWstEthJun2025IsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtWstEthJun2025IsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      wrapperMarketId: WST_ETH_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      unwrapperReadableName: 'PT-wstETH Isolation Mode Unwrapper',
      wrapperReadableName: 'PT-wstETH Isolation Mode Wrapper',
    },
    [ARB_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.ARBIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.ARBIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      wrapperMarketId: ARB_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      unwrapperReadableName: 'ARB Isolation Mode Unwrapper',
      wrapperReadableName: 'ARB Isolation Mode Wrapper',
    },
    [GMX_ISOLATED_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.GMXIsolationModeUnwrapperTraderV4[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GMXIsolationModeWrapperTraderV4[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      wrapperMarketId: GMX_MARKET_ID_MAP[Network.ARBITRUM_ONE]!,
      unwrapperReadableName: 'GMX Isolation Mode Unwrapper',
      wrapperReadableName: 'GMX Isolation Mode Wrapper',
    },
  },
  [Network.ARBITRUM_GOERLI]: {
    [ATLAS_PTSI_MARKET_ID_MAP[Network.ARBITRUM_GOERLI]!.toFixed()]: {
      unwrapper: '0x000000000000000000000000000000000000dead',
      wrapper: '0x000000000000000000000000000000000000dead',
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_GOERLI],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_GOERLI],
      unwrapperReadableName: 'PTSI Isolation Mode Unwrapper',
      wrapperReadableName: 'PTSI Isolation Mode Wrapper',
    },
  },
};

export const LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP: Record<Network, Record<string, ApiMarketConverter>> = {
  [Network.ARBITRUM_ONE]: {
    [MAGIC_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!.toFixed()]: {
      unwrapper: Deployments.MagicGLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.MagicGLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      unwrapperReadableName: 'magicGLP Unwrapper',
      wrapperReadableName: 'magicGLP Wrapper',
    },
  },
  [Network.ARBITRUM_GOERLI]: {},
};

export const ODOS_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address,
  [Network.ARBITRUM_GOERLI]: undefined,
};

export const PARASWAP_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.ParaswapAggregatorTraderV2[Network.ARBITRUM_ONE].address,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PT_GLP_MAR_2024_MARKET_ARBITRUM = '0x7D49E5Adc0EAAD9C027857767638613253eF125f';
const PT_R_ETH_2025_MARKET_ARBITRUM = '0x14FbC760eFaF36781cB0eb3Cb255aD976117B9Bd';
const PT_WST_ETH_2024_MARKET_ARBITRUM = '0xFd8AeE8FCC10aac1897F8D5271d112810C79e022';
const PT_WST_ETH_2025_MARKET_ARBITRUM = '0x08a152834de126d2ef83D612ff36e4523FD0017F';
const PENDLE_MARKET_MAP: Record<Network, Record<Address, Address | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendlePtGLP2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
    PT_GLP_MAR_2024_MARKET_ARBITRUM,
    [Deployments.PendlePtREthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
    PT_R_ETH_2025_MARKET_ARBITRUM,
    [Deployments.PendlePtWstEthJun2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
    PT_WST_ETH_2024_MARKET_ARBITRUM,
    [Deployments.PendlePtWstEthJun2025IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
    PT_WST_ETH_2025_MARKET_ARBITRUM,
    [Deployments.PendleYtGLP2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
    PT_GLP_MAR_2024_MARKET_ARBITRUM,
  },
  [Network.ARBITRUM_GOERLI]: {},
};

const R_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
  [Network.ARBITRUM_GOERLI]: undefined,
};

const S_GLP_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
  [Network.ARBITRUM_GOERLI]: undefined,
};

const WST_ETH_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x5979D7b546E38E414F7E9822514be443A4800529',
  [Network.ARBITRUM_GOERLI]: undefined,
};

export function isPtGlpToken(network: Network, tokenAddress: Address): boolean {
  const ptGlpTokenAddress = Deployments.PendlePtGLP2024IsolationModeVaultFactory[network]?.address;
  return ptGlpTokenAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function isPtREthToken(network: Network, tokenAddress: Address): boolean {
  const ptREthTokenAddress = Deployments.PendlePtREthJun2025IsolationModeVaultFactory[network]?.address;
  return ptREthTokenAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function isPtWstEthJun2024Token(network: Network, tokenAddress: Address): boolean {
  const ptWstEthJun2024TokenAddress = Deployments.PendlePtWstEthJun2024IsolationModeVaultFactory[network]?.address;
  return ptWstEthJun2024TokenAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function isPtWstEthJun2025Token(network: Network, tokenAddress: Address): boolean {
  const ptWstEthJun2024TokenAddress = Deployments.PendlePtWstEthJun2025IsolationModeVaultFactory[network]?.address;
  return ptWstEthJun2024TokenAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function isYtGlpToken(network: Network, tokenAddress: Address): boolean {
  const ytGlpTokenAddress = Deployments.PendleYtGLP2024IsolationModeVaultFactory[network]?.address;
  return ytGlpTokenAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function isSimpleIsolationModeAsset(network: Network, tokenAddress: Address): boolean {
  const arbAddress = Deployments.ARBIsolationModeVaultFactory[network]?.address;
  const gmxAddress = Deployments.GMXIsolationModeVaultFactory[network]?.address;
  return arbAddress?.toLowerCase() === tokenAddress.toLowerCase()
    || gmxAddress?.toLowerCase() === tokenAddress.toLowerCase();
}

export function getGlpIsolationModeAddress(network: Network): Address | undefined {
  return GLP_ISOLATION_MODE_MAP[network];
}

export function getGlpIsolationModeMarketId(network: Network): BigNumber | undefined {
  return GLP_MARKET_ID_MAP[network];
}

export function getSGlpAddress(network: Network): Address | undefined {
  return S_GLP_MAP[network];
}

export function getREthAddress(network: Network): Address | undefined {
  return R_ETH_MAP[network];
}

export function getWstEthAddress(network: Network): Address | undefined {
  return WST_ETH_MAP[network];
}

export function getPendleMarketForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_MARKET_MAP[network][isolationModeToken];
}
