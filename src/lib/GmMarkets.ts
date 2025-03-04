import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import { Address, GmMarketWithMarketId, Network } from './ApiTypes';
import {
  ARB_MARKET_ID_MAP,
  GMX_MARKET_ID_MAP,
  LINK_MARKET_ID_MAP,
  NATIVE_USDC_MARKET_ID_MAP,
  PENDLE_MARKET_ID_MAP,
  UNI_MARKET_ID_MAP,
  USDE_MARKET_ID_MAP,
  WBTC_MARKET_ID_MAP,
  WETH_MARKET_ID_MAP,
  WST_ETH_MARKET_ID_MAP,
} from './MarketIds';

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
  },
  [Network.BASE]: {},
  [Network.BERACHAIN]: {},
  [Network.MANTLE]: {},
  [Network.POLYGON_ZKEVM]: {},
  [Network.X_LAYER]: {},
};
