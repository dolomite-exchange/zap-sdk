import { EstimateOutputResult, Integer } from '../ApiTypes';
import { BYTES_EMPTY } from '../Constants';

export class SimpleEstimator {
  public async getUnwrappedAmount(
    inputAmount: Integer,
  ): Promise<EstimateOutputResult> {
    return { tradeData: BYTES_EMPTY, amountOut: inputAmount };
  }

  public async getWrappedAmount(
    amountIn: Integer,
  ): Promise<EstimateOutputResult> {
    return { tradeData: BYTES_EMPTY, amountOut: amountIn };
  }
}
