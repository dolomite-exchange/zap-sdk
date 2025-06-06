import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import IBerachainRewardsRegistryAbi from '../../abis/IBerachainRewardsRegistry.json';
import IERC4626Abi from '../../abis/IERC4626.json';
import { IBerachainRewardsRegistry } from '../../abis/types/IBerachainRewardsRegistry';
import { IERC4626 } from '../../abis/types/IERC4626';
import { EstimateOutputResult, Integer, Network } from '../ApiTypes';
import { BERACHAIN_REWARDS_REGISTRY_MAP } from '../Constants';
import { POL_MARKETS_MAP } from '../POLMarkets';

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
      this.web3Provider,
    ) as IBerachainRewardsRegistry;
  }

  public async getUnwrappedAmount(
    amountIn: Integer,
    isolationModeTokenAddress: string,
    isLiquidation: boolean,
  ): Promise<EstimateOutputResult> {
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['uint256'],
      [isLiquidation ? 3 : 2], // @dev meta vault accountId
    );
    const polMarket = POL_MARKETS_MAP[this.network][isolationModeTokenAddress];
    const inputMarketId = polMarket!.marketId;

    let amountOutPar: Integer;
    if (isLiquidation) {
      amountOutPar = amountIn;
    } else {
      const feePercentage = new BigNumber(
        (await this.berachainRewardsRegistry!.polFeePercentage(inputMarketId.toFixed())).toString(),
      );
      amountOutPar = amountIn.minus(amountIn.times(feePercentage).dividedToIntegerBy(ONE_ETH));
    }

    const dToken = new ethers.Contract(polMarket!.dTokenAddress, IERC4626Abi, this.web3Provider) as IERC4626;

    const weiOut = await dToken.convertToAssets(amountOutPar.toFixed());
    return {
      tradeData,
      amountOut: new BigNumber(weiOut.toString()),
    };
  }

  public async getWrappedAmount(
    amountIn: Integer,
    isolationModeTokenAddress: string,
  ): Promise<EstimateOutputResult> {
    const tradeData = ethers.utils.defaultAbiCoder.encode(
      ['uint256'],
      [2], // NOTE: This is the meta vault accountId
    );

    const dToken = new ethers.Contract(
      POL_MARKETS_MAP[this.network]![isolationModeTokenAddress]!.dTokenAddress,
      IERC4626Abi,
      this.web3Provider,
    ) as IERC4626;

    const amountOut = await dToken.convertToShares(amountIn.toFixed());
    return {
      tradeData,
      amountOut: new BigNumber(amountOut.toString()),
    };
  }
}
