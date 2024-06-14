import * as Deployments from '@dolomite-exchange/modules-deployments/src/deploy/deployments.json';
import BigNumber from 'bignumber.js';
import { ApiMarket, Network } from '../../src';
import { toChecksumOpt } from '../../src/lib/Utils';
import { getApiMarket } from './TestConstants';

export const USDC_MARKET: ApiMarket = {
  marketId: new BigNumber(2),
  symbol: 'USDC',
  name: 'USDC',
  tokenAddress: toChecksumOpt('0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9')!,
  decimals: 6,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

export const USDE_MARKET: ApiMarket = {
  marketId: new BigNumber(6),
  symbol: 'USDe',
  name: 'USDe',
  tokenAddress: toChecksumOpt('0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34')!,
  decimals: 18,
  isolationModeUnwrapperInfo: undefined,
  liquidityTokenUnwrapperInfo: undefined,
  isolationModeWrapperInfo: undefined,
  liquidityTokenWrapperInfo: undefined,
};

const PT_USDE_JUL_2024_MARKET_ID = new BigNumber(7);
export const PT_USDE_JUL_2024_MARKET: ApiMarket = getApiMarket(
  Network.MANTLE,
  PT_USDE_JUL_2024_MARKET_ID,
  'dPT-rsETH',
  'Dolomite Isolation: PT USDe (JUL-25-2024)',
  Deployments.PendlePtUSDeJul2024IsolationModeVaultFactory[Network.MANTLE].address,
  18,
);
