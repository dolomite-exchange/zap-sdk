import { Address, Network } from "./ApiTypes";

import { POLMarketProps } from "./ApiTypes";

export const POL_MARKETS_MAP: Record<Network.BERACHAIN, Record<Address, POLMarketProps | undefined>> = {
  [Network.BERACHAIN]: {
    ['0x2222222222222222222222222222222222222222']: {
      dTokenAddress: '0x3000C6BF0AAEb813e252B584c4D9a82f99e7a71D'
    },
  }
}