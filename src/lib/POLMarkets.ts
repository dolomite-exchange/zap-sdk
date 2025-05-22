import ModuleDeployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { Address, Network, POLMarketProps } from './ApiTypes';

const network = Network.BERACHAIN;

export const POL_MARKETS_MAP: Record<Network.BERACHAIN, Record<Address, POLMarketProps | undefined>> = {
  [network]: {
    [ModuleDeployments.POLrUsdIsolationModeVaultFactory[network].address]: {
      marketId: new BigNumber(39),
      dTokenAddress: '0x3000C6BF0AAEb813e252B584c4D9a82f99e7a71D',
    },
    HONEY: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0x7f2B60fDff1494A0E3e060532c9980d7fad0404B',
    },
    sdeUSD: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0xF2bEa39f04Fb7A8fA4A404F013650f2A4f0b0c57',
    },
    srUSD: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0xb9816a01B116d86c8D9A1A4ED4CC644177b8FD67',
    },
    USDC: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0x444868B6e8079ac2c55eea115250f92C2b2c4D14',
    },
    USDT: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0xF2d2d55Daf93b0660297eaA10969eBe90ead5CE8',
    },
    WBTC: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0x29cF6e8eCeFb8d3c9dd2b727C1b7d1df1a754F6f',
    },
    WETH: {
      marketId: new BigNumber(-1),
      dTokenAddress: '0xf7b5127B510E568fdC39e6Bb54e2081BFaD489AF',
    },
  },
};
