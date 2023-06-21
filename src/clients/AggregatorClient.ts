import { Address, AggregatorOutput, ApiMarket, ApiToken, Integer, Network } from '../lib/ApiTypes';

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
  ): Promise<AggregatorOutput | undefined>
}
