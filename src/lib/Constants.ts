import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Address, GmMarketWithMarketId, Network } from './ApiTypes';
import { GLV_MARKETS_MAP } from './GlvMarkets';
import { GM_MARKETS_MAP } from './GmMarkets';
import { GraphqlToken } from './GraphqlTypes';
import { PENDLE_PT_MARKET_MAP } from './PendlePtMarkets';
import { PENDLE_YT_MARKET_MAP } from './PendleYtMarkets';

export const INTEGERS = {
  NEGATIVE_ONE: new BigNumber(-1),
  ZERO: new BigNumber(0),
  ONE: new BigNumber(1),
  TEN: new BigNumber(10),
};

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const INVALID_NAME = 'INVALID';

export const BYTES_EMPTY = '0x';

export const DOLOMITE_API_SERVER_URL = 'https://api.dolomite.io';

// OTHER ADDRESSES

export const ARBITRUM_GAS_INFO_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x000000000000000000000000000000000000006C',
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

export const GLV_REGISTRY_PROXY_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: '0x14F7137BAD9339c0901Df6728FF4B798F0f4429C',
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

export const MULTICALL_MAP: Record<Network, Address> = {
  [Network.ARBITRUM_ONE]: '0xB18B8B1A5BDEa1f3c9776715b9325F932803FB1f',
  [Network.BASE]: '0x836b557Cf9eF29fcF49C776841191782df34e4e5',
  [Network.BERACHAIN]: '0x58142bd85E67C40a7c0CCf2e1EEF6eB543617d2A',
  [Network.MANTLE]: '0x6978Ffdcd509dED2F8557565e0a9FC5CFA1bEbc5',
  [Network.POLYGON_ZKEVM]: '0x4232FCE0D67839F4FD536990bDc02043d9Ab708a',
  [Network.X_LAYER]: '0x86CFc6BA3bbBC603b8deC5B032aFa10A3592470D',
};

export const ODOS_TRADER_ADDRESS_MAP: Record<Network, Address | undefined> = {
  [Network.ARBITRUM_ONE]: Deployments.OdosAggregatorTrader[Network.ARBITRUM_ONE].address,
  [Network.BASE]: undefined,
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
  [Network.BASE]: undefined,
  [Network.BERACHAIN]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: Deployments.ParaswapAggregatorTraderV2[Network.POLYGON_ZKEVM].address,
  [Network.X_LAYER]: undefined,
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
