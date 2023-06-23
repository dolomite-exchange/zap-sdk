import * as Deployments from '@dolomite-exchange/dolomite-margin-modules/scripts/deployments.json';
import BigNumber from 'bignumber.js';
import { Address, MarketId, Network } from './ApiTypes';

interface Converter {
  unwrapper: Address;
  wrapper: Address;
  unwrapperMarketId: number;
  wrapperMarketId: number;
}

export const INTEGERS = {
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
};

export const BYTES_EMPTY = '0x';

const USDC_MARKET_ID_MAP: Record<number, number> = {
  [Network.ARBITRUM_ONE]: 2,
  [Network.ARBITRUM_GOERLI]: 2,
};

const ATLAS_PTSI_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 5,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 6,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const MAGIC_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 8,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PLV_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 9,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const JONES_USDC_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 10,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const PENDLE_PT_GLP_MARKET_ID_MAP: Record<Network, MarketId | undefined> = {
  [Network.ARBITRUM_ONE]: 11,
  [Network.ARBITRUM_GOERLI]: undefined,
};

const GLP_ISOLATION_MODE_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.GLPIsolationModeVaultFactory[Network.ARBITRUM_ONE].address,
  [Network.ARBITRUM_GOERLI]: undefined,
};

export const ISOLATION_MODE_CONVERSION_MARKET_ID_MAP: Record<Network, Record<MarketId, Converter | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!]: {
      unwrapper: Deployments.GLPIsolationModeUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.GLPIsolationModeWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
    },
    [PLV_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!]: {
      unwrapper: Deployments.PlutusVaultGLPIsolationModeUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PlutusVaultGLPIsolationModeWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
    },
    [JONES_USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE]!]: {
      unwrapper: Deployments.JonesUSDCIsolationModeUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.JonesUSDCIsolationModeWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
    },
    [PENDLE_PT_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!]: {
      unwrapper: Deployments.PendlePtGLP2024IsolationModeUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.PendlePtGLP2024IsolationModeWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
    },
  },
  [Network.ARBITRUM_GOERLI]: {
    [ATLAS_PTSI_MARKET_ID_MAP[Network.ARBITRUM_GOERLI]!]: {
      unwrapper: '',
      wrapper: '',
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_GOERLI],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_GOERLI],
    },
  },
};

export const LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP: Record<Network, Record<MarketId, Converter>> = {
  [Network.ARBITRUM_ONE]: {
    [MAGIC_GLP_MARKET_ID_MAP[Network.ARBITRUM_ONE]!]: {
      unwrapper: Deployments.MagicGLPUnwrapperTraderV2[Network.ARBITRUM_ONE].address,
      wrapper: Deployments.MagicGLPWrapperTraderV2[Network.ARBITRUM_ONE].address,
      unwrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
      wrapperMarketId: USDC_MARKET_ID_MAP[Network.ARBITRUM_ONE],
    },
  },
  [Network.ARBITRUM_GOERLI]: {},
};

export const PARASWAP_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.ParaswapAggregatorTrader[Network.ARBITRUM_ONE].address,
  [Network.ARBITRUM_GOERLI]: undefined,
}

const PENDLE_MARKET_MAP: Record<Network, Record<Address, Address | undefined>> = {
  [Network.ARBITRUM_ONE]: {
    [Deployments.PendlePtGLP2024IsolationModeVaultFactory[Network.ARBITRUM_ONE].address]:
      '0x7D49E5Adc0EAAD9C027857767638613253eF125f',
  },
  [Network.ARBITRUM_GOERLI]: {},
};

const S_GLP_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
  [Network.ARBITRUM_GOERLI]: undefined,
};

export function isPtGlpToken(network: Network, tokenAddress: Address): boolean {
  return !!PENDLE_MARKET_MAP[network][tokenAddress];
}

export function getGlpIsolationModeAddress(network: Network): Address | undefined {
  return GLP_ISOLATION_MODE_MAP[network];
}

export function getGlpIsolationModeMarketId(network: Network): number | undefined {
  return GLP_MARKET_ID_MAP[network];
}

export function getSGlpAddress(network: Network): Address | undefined {
  return S_GLP_MAP[network];
}

export function getPendleMarketForIsolationModeToken(
  network: Network,
  isolationModeToken: Address,
): Address | undefined {
  return PENDLE_MARKET_MAP[network][isolationModeToken];
}
