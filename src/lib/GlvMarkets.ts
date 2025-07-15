import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import { Address, GlvMarket, Network } from './ApiTypes';
import { NATIVE_USDC_MARKET_ID_MAP, WBTC_MARKET_ID_MAP, WETH_MARKET_ID_MAP } from './MarketIds';

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
  [Network.BOTANIX]: undefined,
  [Network.ETHEREUM]: undefined,
  [Network.INK]: undefined,
  [Network.MANTLE]: undefined,
  [Network.POLYGON_ZKEVM]: undefined,
  [Network.X_LAYER]: undefined,
};
