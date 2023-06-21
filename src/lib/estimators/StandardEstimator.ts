import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IDolomiteMarginExchangeWrapper from '../../abis/IDolomiteMarginExchangeWrapper.json';
import { Address, ApiMarket, EstimateOutputResults, Integer, MarketId } from '../ApiTypes';
import { BYTES_EMPTY } from '../Constants';

export class StandardEstimator {
  private readonly web3Provider: ethers.providers.Provider;
  private readonly marketsMap: Record<MarketId, ApiMarket>;

  public constructor(
    web3Provider: ethers.providers.Provider,
    marketsMap: Record<MarketId, ApiMarket>,
  ) {
    this.web3Provider = web3Provider;
    this.marketsMap = marketsMap;
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    unwrapperAddress: Address,
    amountIn: Integer,
    outputMarketId: number,
  ): Promise<EstimateOutputResults> {
    const outputMarket = this.marketsMap[outputMarketId];
    const contract = new ethers.Contract(unwrapperAddress, IDolomiteMarginExchangeWrapper, this.web3Provider);
    const tradeData = BYTES_EMPTY;
    const outputAmount = await contract.getExchangeCost(
      isolationModeTokenAddress,
      outputMarket.tokenAddress,
      amountIn.toFixed(),
      tradeData,
    );
    return { amountOut: new BigNumber(outputAmount.toString()), tradeData };
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    unwrapperAddress: Address,
    amountIn: Integer,
    inputMarketId: number,
  ): Promise<EstimateOutputResults> {
    const inputMarket = this.marketsMap[inputMarketId];
    const contract = new ethers.Contract(unwrapperAddress, IDolomiteMarginExchangeWrapper, this.web3Provider);
    const tradeData = BYTES_EMPTY;
    const outputAmount = await contract.getExchangeCost(
      inputMarket.tokenAddress,
      isolationModeTokenAddress,
      amountIn.toFixed(),
      tradeData,
    );
    return { amountOut: new BigNumber(outputAmount.toString()), tradeData };
  }
}
