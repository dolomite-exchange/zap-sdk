import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network, ZapConfig } from '../lib/ApiTypes';

export default abstract class AggregatorClient {
  public readonly network: Network;

  protected constructor(network: Network) {
    this.network = network;
  }

  public abstract isValidForNetwork(): boolean;

  public abstract getSwapExactTokensForTokensData(
    inputMarket: ApiMarket | ApiToken,
    inputAmountWei: Integer,
    outputMarket: ApiMarket | ApiToken,
    minOutputAmountWei: Integer,
    txOrigin: Address,
    config: ZapConfig,
  ): Promise<AggregatorOutput | undefined>
}
