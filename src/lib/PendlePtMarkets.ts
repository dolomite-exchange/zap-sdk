import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import { Address, Network, PendleMarketProps } from './ApiTypes';
import {
  CM_ETH_MAP,
  EZ_ETH_MAP,
  METH_MAP,
  R_ETH_MAP,
  RS_ETH_MAP,
  S_GLP_MAP,
  USDE_MAP,
  WE_ETH_MAP,
  WMNT_MAP,
  WST_ETH_MAP,
} from './Tokens';

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

export const PENDLE_PT_MARKET_MAP: Record<Network, Record<Address, PendleMarketProps | undefined>> = {
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
  [Network.BERACHAIN_BARTIO]: {},
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
