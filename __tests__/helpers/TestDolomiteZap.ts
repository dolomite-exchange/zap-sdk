import { DolomiteZap, Network, ReferralOutput } from '../../src';
import AggregatorClient from '../../src/clients/AggregatorClient';
import OdosAggregator from '../../src/clients/OdosAggregator';
import { TestParaswapAggregator } from './TestParaswapAggregator';

export class TestDolomiteZap extends DolomiteZap {


  protected getAllAggregators(
    network: Network,
    referralInfo: ReferralOutput,
    useProxyServer: boolean,
  ): AggregatorClient[] {
    const odos = new OdosAggregator(network, referralInfo.odosReferralCode, useProxyServer);
    const paraswap = new TestParaswapAggregator(network, referralInfo.referralAddress, useProxyServer);
    return [odos, paraswap];
  }
}
