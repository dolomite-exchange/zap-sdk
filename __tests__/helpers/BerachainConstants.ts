import BigNumber from 'bignumber.js';
import { ApiMarket } from '../../src';
import { toChecksumOpt } from '../../src/lib/Utils';

export const IBGT_MARKET: ApiMarket = {
  marketId: new BigNumber(34),
  symbol: 'iBGT',
  name: 'iBGT',
  tokenAddress: toChecksumOpt('0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const IBGT_STAKED_MARKET: ApiMarket = {
  marketId: new BigNumber(38),
  symbol: 'siBGT',
  name: 'Staked iBGT',
  tokenAddress: toChecksumOpt('0x589B3B5E75D5475908C6C2EBD1F2f68eeCA52eE4')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const POL_RUSD_MARKET: ApiMarket = {
  marketId: new BigNumber(39),
  symbol: 'pol-rUSD',
  name: 'Dolomite Isolation: pol-rUSD',
  tokenAddress: toChecksumOpt('0x5DB5ef3D657471d991e4de09983D2c92b0609749')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const RUSD_MARKET: ApiMarket = {
  marketId: new BigNumber(8),
  symbol: 'rUSD',
  name: 'Reservoir Stablecoin',
  tokenAddress: toChecksumOpt('0x09D4214C03D01F49544C0448DBE3A27f768F2b34')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const USDC_MARKET: ApiMarket = {
  marketId: new BigNumber(2),
  symbol: 'USDC',
  name: 'USD Coin',
  tokenAddress: toChecksumOpt('0x549943e04f40284185054145c6E4e9568C1D3241')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const WETH_MARKET: ApiMarket = {
  marketId: new BigNumber(0),
  symbol: 'WETH',
  name: 'Wrapped Ether',
  tokenAddress: toChecksumOpt('0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};
