import axios from 'axios';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import IArbitrumGasInfoAbi from '../../abis/IArbitrumGasInfo.json';
import IGmxV2DataStoreAbi from '../../abis/IGmxV2DataStore.json';
import IGmxV2ReaderAbi from '../../abis/IGmxV2Reader.json';
import { IArbitrumGasInfo } from '../../abis/types/IArbitrumGasInfo';
import { IGmxV2DataStore } from '../../abis/types/IGmxV2DataStore';
import { GmxMarket, IGmxV2Reader } from '../../abis/types/IGmxV2Reader';
import { Address, ApiMarket, EstimateOutputResult, Integer, MarketId, Network, ZapConfig } from '../ApiTypes';
import { ADDRESS_ZERO, ARBITRUM_GAS_INFO_MAP, GMX_V2_DATA_STORE_MAP, GMX_V2_READER_MAP } from '../Constants';
import MarketPricesStruct = GmxMarket.MarketPricesStruct;

interface SignedPriceData {
  tokenAddress: string;
  minPriceFull: string;
  maxPriceFull: string;
}

const abiCoder = ethers.utils.defaultAbiCoder;

const CALLBACK_GAS_LIMIT = ethers.BigNumber.from(2_000_000);

const DEPOSIT_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32', 'bool'],
    [keccak256(abiCoder.encode(['string'], ['DEPOSIT_GAS_LIMIT'])), /* _singleToken = */ true],
  ),
);

const WITHDRAWAL_GAS_LIMIT_KEY = keccak256(
  abiCoder.encode(
    ['bytes32'],
    [keccak256(abiCoder.encode(['string'], ['WITHDRAWAL_GAS_LIMIT']))],
  ),
);

export class GmxV2GmEstimator {
  private readonly gmxV2Reader: IGmxV2Reader;
  private readonly gmxV2DataStore: IGmxV2DataStore;
  private readonly arbitrumGasInfo: IArbitrumGasInfo;

  public constructor(
    private readonly network: Network,
    private readonly web3Provider: ethers.providers.Provider,
  ) {
    this.gmxV2Reader = new ethers.Contract(
      GMX_V2_READER_MAP[this.network]!,
      IGmxV2ReaderAbi,
      this.web3Provider,
    ) as IGmxV2Reader;

    this.gmxV2DataStore = new ethers.Contract(
      GMX_V2_DATA_STORE_MAP[this.network]!,
      IGmxV2DataStoreAbi,
      this.web3Provider,
    ) as IGmxV2DataStore;

    this.arbitrumGasInfo = new ethers.Contract(
      ARBITRUM_GAS_INFO_MAP[this.network]!,
      IArbitrumGasInfoAbi,
      this.web3Provider,
    ) as IArbitrumGasInfo;
  }

  private static getPricesStruct(
    pricesMap: Record<Address, SignedPriceData>,
    indexToken: Address,
    longToken: Address,
    shortToken: Address,
  ): MarketPricesStruct {
    return {
      indexTokenPrice: {
        min: pricesMap[indexToken].minPriceFull,
        max: pricesMap[indexToken].maxPriceFull,
      },
      longTokenPrice: {
        min: pricesMap[longToken].minPriceFull,
        max: pricesMap[longToken].maxPriceFull,
      },
      shortTokenPrice: {
        min: pricesMap[shortToken].minPriceFull,
        max: pricesMap[shortToken].maxPriceFull,
      },
    };
  }

  public async getUnwrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    outputMarketId: MarketId,
    config: ZapConfig,
    marketsMap: Record<string, ApiMarket>,
  ): Promise<EstimateOutputResult> {
    // TODO: convert to lowest amount out for non-outputMarketId via the signed price data
  }

  public async getWrappedAmount(
    isolationModeTokenAddress: Address,
    amountIn: Integer,
    inputMarketId: MarketId,
    marketsMap: Record<string, ApiMarket>,
  ): Promise<EstimateOutputResult> {
    const tokenToSignedPriceMap = await axios.get('https://arbitrum-api.gmxinfra.io/signed_prices/latest')
      .then(res => res.data)
      .then(data => (data.signedPrices as SignedPriceData[]).reduce((memo, priceData) => {
        memo[priceData.tokenAddress] = priceData;
        return memo;
      }, {}));
    const inputToken = marketsMap[inputMarketId.toFixed()];

    // TODO: get market token based on isolationModeTokenAddress
    const indexToken = '';
    const longToken = '';
    const shortToken = '';
    const marketToken = '';

    const amountOut = await this.gmxV2Reader.getDepositAmountOut(
      this.gmxV2DataStore.address,
      {
        indexToken,
        longToken,
        shortToken,
        marketToken,
      },
      GmxV2GmEstimator.getPricesStruct(tokenToSignedPriceMap, indexToken, longToken, shortToken),
      inputToken.tokenAddress === longToken ? amountIn.toFixed() : '0',
      inputToken.tokenAddress === shortToken ? amountIn.toFixed() : '0',
      ADDRESS_ZERO,
    );

    const depositGasLimit = (await this.gmxV2DataStore.getUint(DEPOSIT_GAS_LIMIT_KEY)).add(CALLBACK_GAS_LIMIT);
    const gasPriceWei = (await this.arbitrumGasInfo.getPricesInWei())[5];

    console.log('depositGasLimit.mul(gasPriceWei)', depositGasLimit.mul(gasPriceWei).toString());
    return {
      amountOut: new BigNumber(amountOut.toString()),
      tradeData: abiCoder.encode(['uint256'], [depositGasLimit.mul(gasPriceWei)]),
    }
  }
}
