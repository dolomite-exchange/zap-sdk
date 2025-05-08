import { ethers } from "ethers";
import { IBerachainRewardsRegistry } from "../../abis/types/IBerachainRewardsRegistry";
import { EstimateOutputResult, Integer, MarketId, Network } from "../ApiTypes";
import IBerachainRewardsRegistryAbi from '../../abis/IBerachainRewardsRegistry.json';
import { BERACHAIN_REWARDS_REGISTRY_MAP } from "../Constants";
import IERC4626Abi from '../../abis/IERC4626.json';
import BigNumber from 'bignumber.js';
import { POL_MARKETS_MAP } from "../POLMarkets";
import { IERC4626 } from "../../abis/types/IERC4626";

const ONE_ETH = new BigNumber(1).times(10).pow(18);

export class POLEstimator {
  private readonly berachainRewardsRegistry?: IBerachainRewardsRegistry; 

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
  ) {
    if (network !== Network.BERACHAIN) {
      return;
    }

    this.berachainRewardsRegistry = new ethers.Contract(
      BERACHAIN_REWARDS_REGISTRY_MAP[this.network]!,
      IBerachainRewardsRegistryAbi,
    ) as IBerachainRewardsRegistry;
  }

  public async getUnwrappedAmount(
    amountIn: Integer,
    inputMarketId: MarketId,
    outputMarketId: MarketId,
    isLiquidation: boolean
  ): Promise<EstimateOutputResult> {
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['uint256'],
      [isLiquidation ? 3 : 2] // @dev metavaultAccountId
    );

    let amountOutPar: Integer;
    if (isLiquidation) {
      amountOutPar = amountIn;
    } else {
      const feePercentage = new BigNumber((await this.berachainRewardsRegistry!.polFeePercentage(inputMarketId.toFixed())).toString());
      amountOutPar = amountIn.minus(amountIn.times(feePercentage).div(ONE_ETH));
    }

    const dToken = new ethers.Contract(
      POL_MARKETS_MAP[this.network]![outputMarketId.toFixed()]!.dTokenAddress,
      IERC4626Abi,
      this.web3Provider
    ) as IERC4626;

    const weiOut = await dToken.convertToAssets(amountOutPar.toFixed());
    return {
      tradeData,
      amountOut: new BigNumber(weiOut.toString())
    };
  }

  public async getWrappedAmount(
    amountIn: Integer,
    inputMarketId: MarketId
  ): Promise<EstimateOutputResult> {
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['uint256'],
      [2] // @dev metavaultAccountId
    );

    const dToken = new ethers.Contract(
      POL_MARKETS_MAP[this.network]![inputMarketId.toFixed()]!.dTokenAddress,
      IERC4626Abi,
      this.web3Provider     
    ) as IERC4626;

    const amountOut = await dToken.convertToShares(amountIn.toFixed());
    return {
      tradeData,
      amountOut: new BigNumber(amountOut.toString()),
    };
  }
}