import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Network } from '../../src';
import DolomiteClient from '../../src/clients/DolomiteClient';

describe('DolomiteClient', () => {
  const networkId = Network.ARBITRUM_ONE;
  const subgraphUrl = process.env.SUBGRAPH_URL;
  if (!subgraphUrl) {
    throw new Error('SUBGRAPH_URL env var not set')
  }
  const web3Provider = new ethers.providers.JsonRpcProvider(process.env.WEB3_PROVIDER_URL);
  const dolomite = new DolomiteClient(networkId, subgraphUrl, web3Provider, new BigNumber(1));

  describe('#getDolomiteMarkets', () => {
    it('should work for specific block number', async () => {
      const blockNumber = 100_000_000;
      const marketsMap = await dolomite.getDolomiteMarketsMap(blockNumber);
      expect(Object.keys(marketsMap).length).toEqual(10);
    });

    it('should work for latest block tag', async () => {
      const marketsMap = await dolomite.getDolomiteMarketsMap('latest');
      expect(Object.keys(marketsMap).length).toBeGreaterThanOrEqual(10);

      const dfsGlp = marketsMap['6'];
      expect(dfsGlp).toBeDefined();
      expect(dfsGlp!.isolationModeUnwrapperInfo).toBeDefined();
      expect(dfsGlp!.isolationModeWrapperInfo).toBeDefined();
      expect(dfsGlp!.liquidityTokenWrapperInfo).toBeUndefined();
      expect(dfsGlp!.liquidityTokenWrapperInfo).toBeUndefined();

      const dplvGlp = marketsMap['9'];
      expect(dplvGlp).toBeDefined();
      expect(dplvGlp!.isolationModeUnwrapperInfo).toBeDefined();
      expect(dplvGlp!.isolationModeWrapperInfo).toBeDefined();
      expect(dplvGlp!.liquidityTokenWrapperInfo).toBeUndefined();
      expect(dplvGlp!.liquidityTokenWrapperInfo).toBeUndefined();

      const mGlp = marketsMap['8'];
      expect(mGlp).toBeDefined();
      expect(mGlp!.isolationModeUnwrapperInfo).toBeUndefined();
      expect(mGlp!.isolationModeWrapperInfo).toBeUndefined();
      expect(mGlp!.liquidityTokenWrapperInfo).toBeDefined();
      expect(mGlp!.liquidityTokenWrapperInfo).toBeDefined();
    });
  });
});
