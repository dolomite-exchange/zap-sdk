import BigNumber from 'bignumber.js';
import { ApiMarket } from '../../src';
import { toChecksumOpt } from '../../src/lib/Utils';

export const PBTC_MARKET: ApiMarket = {
  marketId: new BigNumber(1),
  symbol: 'pBTC',
  name: 'pBTC',
  tokenAddress: toChecksumOpt('0x0D2437F93Fed6EA64Ef01cCde385FB1263910C56')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const USDC_MARKET: ApiMarket = {
  marketId: new BigNumber(2),
  symbol: 'USDC.e',
  name: 'USDC.e',
  tokenAddress: toChecksumOpt('0x29eE6138DD4C9815f46D34a4A1ed48F46758A402')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};
