/* eslint-disable max-len */
import { ApiMarket, MarketId, Network } from '../../src';
import { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP } from '../../src/lib/Constants';

export const SLEEP_DURATION_BETWEEN_TESTS = 6_000;

export function getApiMarket(
  network: Network,
  marketId: MarketId,
  symbol: string,
  name: string,
  tokenAddress: string,
  decimals: number,
): ApiMarket {
  return {
    marketId,
    symbol,
    name,
    tokenAddress,
    decimals,
    isolationModeUnwrapperInfo: {
      unwrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapper,
      outputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperMarketIds,
      readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperReadableName,
    },
    liquidityTokenUnwrapperInfo: undefined,
    isolationModeWrapperInfo: {
      wrapperAddress: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapper,
      inputMarketIds: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapperMarketIds,
      readableName: ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.wrapperReadableName,
    },
    liquidityTokenWrapperInfo: undefined,
  };
}

export function setUnwrapperMarketIdByMarketId(
  marketId: MarketId,
  outputMarketId: MarketId,
  network: Network = Network.ARBITRUM_ONE,
) {
  ISOLATION_MODE_CONVERSION_MARKET_ID_MAP[network][marketId.toFixed()]!.unwrapperMarketIds = [outputMarketId];
}
