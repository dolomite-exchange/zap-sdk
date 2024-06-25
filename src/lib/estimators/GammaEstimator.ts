import { ethers } from "ethers";
import { Address, ApiMarket, EstimateOutputResult, Integer, Network, ZapConfig } from "../ApiTypes";
import AggregatorClient from "../../clients/AggregatorClient";
import { INTEGERS, getGammaPool } from "../Constants";
import { IDeltaPair } from "../../abis/types/IDeltaPair";
import IDeltaPairAbi from "../../abis/IDeltaPair.json";
import IGammaPoolAbi from "../../abis/IGammaPool.json";
import IERC20Abi from "../../abis/IERC20.json";
import { IERC20 } from "../../abis/types/IERC20";
import BigNumber from "bignumber.js";
import { IGammaPool } from "../../abis/types/IGammaPool";

const abiCoder = ethers.utils.defaultAbiCoder;

export class GammaEstimator {
  public constructor(
    public readonly network: Network,
    public readonly web3Provider: ethers.providers.Provider,
    public readonly aggregator: AggregatorClient
  ) {}

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    outputMarketId: Integer,
    marketsMap: Record<string, ApiMarket>,
    txOrigin: Address,
    config: ZapConfig
  ): Promise<EstimateOutputResult> {
    // Get necessary contracts
    const gammaPool = getGammaPool(this.network, isolationModeTokenAddress);
    const gammaPoolContract = new ethers.Contract(
      gammaPool!.poolAddress,
      IGammaPoolAbi,
      this.web3Provider
    ) as IGammaPool;
    const deltaPair = new ethers.Contract(
      gammaPool!.cfmm,
      IDeltaPairAbi,
      this.web3Provider
    ) as IDeltaPair;
    const token0 = new ethers.Contract(
      gammaPool!.token0Address,
      IERC20Abi,
      this.web3Provider
    ) as IERC20;
    const token1 = new ethers.Contract(
      gammaPool!.token1Address,
      IERC20Abi,
      this.web3Provider
    ) as IERC20;

    // Calculate amounts and input/output token
    // @todo use multicall. Arbitrum mulitcall has special one
    const totalSupply = new BigNumber((await deltaPair.totalSupply()).toString());
    const token0Bal = new BigNumber((await token0.balanceOf(deltaPair.address)).toString());
    const token1Bal = new BigNumber((await token1.balanceOf(deltaPair.address)).toString());
    const outputToken = marketsMap[outputMarketId.toFixed()];
    let inputToken: ApiMarket;
    if (outputToken.tokenAddress === gammaPool!.token0Address) {
      inputToken = marketsMap[gammaPool!.token1MarketId];
    } else {
      inputToken = marketsMap[gammaPool!.token0MarketId];
    }

    const assets = new BigNumber((await gammaPoolContract.convertToAssets(amountIn.toNumber())).toString());

    const token0Amount = assets.times(token0Bal).dividedToIntegerBy(totalSupply);
    const token1Amount = assets.times(token1Bal).dividedToIntegerBy(totalSupply);
    const swapAmount = outputToken.tokenAddress === gammaPool!.token0Address ? token1Amount : token0Amount;
    const keepAmount = outputToken.tokenAddress === gammaPool!.token0Address ? token0Amount : token1Amount;

    // Get aggregator info for unwanted token -> output token
    const aggregatorOutput = await this.aggregator.getSwapExactTokensForTokensData(
      inputToken,
      swapAmount,
      outputToken,
      INTEGERS.ONE,
      txOrigin,
      config
    );
    return {
      tradeData: abiCoder.encode(
        ['address', 'bytes'],
        [this.aggregator.address, abiCoder.encode(['uint256', 'bytes'], [1, aggregatorOutput!.tradeData])]
      ),
      amountOut: aggregatorOutput!.expectedAmountOut.plus(keepAmount)
    };
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    inputMarketId: Integer,
    marketsMap: Record<string, ApiMarket>,
    txOrigin: Address,
    config: ZapConfig
  ): Promise<EstimateOutputResult> {
    const gammaPool = getGammaPool(this.network, isolationModeTokenAddress);
    const gammaPoolContract = new ethers.Contract(
      gammaPool!.poolAddress,
      IGammaPoolAbi,
      this.web3Provider
    ) as IGammaPool;
    const deltaPair = new ethers.Contract(
      gammaPool!.cfmm,
      IDeltaPairAbi,
      this.web3Provider
    ) as IDeltaPair;

    // Calculate aggregator swap
    const tradeAmount = amountIn.div(2).integerValue(BigNumber.ROUND_FLOOR);
    const depositAmount = amountIn.minus(tradeAmount);
    const inputToken = marketsMap[inputMarketId.toFixed()];
    let outputToken: ApiMarket;
    if (inputToken.tokenAddress === gammaPool!.token0Address) {
      outputToken = marketsMap[gammaPool!.token1MarketId];
    } else {
      outputToken = marketsMap[gammaPool!.token0MarketId];
    }

    const aggregatorOutput = await this.aggregator.getSwapExactTokensForTokensData(
      inputToken,
      tradeAmount,
      outputToken,
      INTEGERS.ONE,
      txOrigin,
      config
    );

    // Calculate expected amount of LP tokens
    const token0Amount = inputToken.tokenAddress === gammaPool!.token0Address ? depositAmount : aggregatorOutput?.expectedAmountOut;
    const token1Amount = inputToken.tokenAddress === gammaPool!.token1Address ? depositAmount : aggregatorOutput?.expectedAmountOut;

    const reserve0 = new BigNumber((await deltaPair.getReserves())[0].toString());
    const reserve1 = new BigNumber((await deltaPair.getReserves())[1].toString());
    const totalSupply = new BigNumber((await deltaPair.totalSupply()).toString());

    const liquidity0 = token0Amount?.times(totalSupply).dividedBy(reserve0).integerValue(BigNumber.ROUND_FLOOR).toNumber();
    const liquidity1 = token1Amount?.times(totalSupply).dividedBy(reserve1).integerValue(BigNumber.ROUND_FLOOR).toNumber();
    const outputAmount = Math.min(liquidity0!, liquidity1!);

    return {
      tradeData: abiCoder.encode(
        ['address', 'bytes'],
        [this.aggregator.address, abiCoder.encode(['uint256', 'bytes'], [1, aggregatorOutput!.tradeData])]
      ),
      amountOut: new BigNumber((await gammaPoolContract.convertToShares(outputAmount)).toString())
    };
  }
}