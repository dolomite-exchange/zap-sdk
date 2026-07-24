import { DolomiteZap, Network, ReferralOutput } from '../../src';
import AggregatorClient from '../../src/clients/AggregatorClient';
import { TestParaswapAggregator } from './TestParaswapAggregator';

export class TestDolomiteZap extends DolomiteZap {
  protected getAllAggregators(
    network: Network,
    referralInfo: ReferralOutput,
    useProxyServer: boolean,
  ): AggregatorClient[] {
    const paraswap = new TestParaswapAggregator(network, referralInfo.referralAddress, useProxyServer);
    return [paraswap];
  }
}
