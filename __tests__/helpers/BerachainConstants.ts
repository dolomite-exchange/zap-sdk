import BigNumber from 'bignumber.js';
import { ApiMarket } from '../../src';
import { toChecksumOpt } from '../../src/lib/Utils';

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
