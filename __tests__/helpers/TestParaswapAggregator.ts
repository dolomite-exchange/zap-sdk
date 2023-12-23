import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, ZapConfig } from '../../src';
import ParaswapAggregator from '../../src/clients/ParaswapAggregator';

export class TestParaswapAggregator extends ParaswapAggregator {

  public async getSwapExactTokensForTokensData(
    _inputMarket: ApiMarket | ApiToken,
    _inputAmountWei: Integer,
    _outputMarket: ApiMarket | ApiToken,
    _minOutputAmountWei: Integer,
    _txOrigin: Address,
    _unused: ZapConfig,
  ): Promise<AggregatorOutput | undefined> {
    return Promise.reject(new Error('DEAD'));
  }
}
