import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import { Address, Network, PendleMarketProps } from './ApiTypes';
import { S_GLP_MAP } from './Tokens';

const PT_GLP_MAR_2024_MARKET_ARBITRUM = '0x7D49E5Adc0EAAD9C027857767638613253eF125f';

export const PENDLE_YT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
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
  [Network.BERACHAIN_BARTIO]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};
