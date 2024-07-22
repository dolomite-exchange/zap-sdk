import BigNumber from 'bignumber.js';
import { ApiMarket } from '../../src';
import { toChecksumOpt } from '../../src/lib/Utils';

export const WETH_MARKET: ApiMarket = {
  marketId: new BigNumber(0),
  symbol: 'WETH',
  name: 'Wrapped Ether',
  tokenAddress: toChecksumOpt('0x6E1E9896e93F7A71ECB33d4386b49DeeD67a231A')!,
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
  tokenAddress: toChecksumOpt('0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};
