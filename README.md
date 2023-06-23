<p style="text-align: center"><img src="https://github.com/dolomite-exchange/dolomite-margin/raw/master/docs/dolomite-logo.png" width="256" alt="Dolomite Logo" /></p>

<div style="text-align: center">
    <a href='https://coveralls.io/github/dolomite-exchange/zap-sdk?branch=master'>
        <img src='https://coveralls.io/repos/github/dolomite-exchange/zap-sdk/badge.svg?branch=master&amp;t=ZbXsH3' alt='Coverage Status' />
    </a>
      <a href='https://github.com/dolomite-exchange/zap-sdk/blob/master/LICENSE' style="text-decoration:none;">
        <img src='https://img.shields.io/github/license/dolomite-exchange/zap-sdk.svg?longCache=true' alt='License' />
      </a>
      <a href='https://t.me/dolomite-official' style="text-decoration:none;">
        <img src='https://img.shields.io/badge/chat-on%20telegram-9cf.svg?longCache=true' alt='Telegram' />
      </a>
</div>

# Dolomite Zap SDK

SDK for zapping any asset to any asset on Dolomite.

## Usage

### Installation

```bash
npm install @dolomite-exchange/zap-sdk
```

or if you use `yarn`

```bash
yarn add @dolomite-exchange/zap-sdk
```

### Initialization

```typescript
import { Network } from './ApiTypes';
import { DolomiteZap } from './DolomiteZap';

const network = Network.ARBITRUM_ONE;
const subgraphUrl = procses.env.SUBGRAPH_URL; // TODO replace with a URL to the Dolomite subgraph
const web3Provider = window.ethereum; // TODO replace with a web3 provider
const cacheSeconds = 60 * 60; // 1 hour
const zap = new DolomiteZap(
  network,
  subgraphUrl,
  web3Provider,
  cacheSeconds,
);
```

### Zapping

```typescript
import { DolomiteZap } from './DolomiteZap';

let zap: DolomiteZap;

const tokenIn = WETH_MARKET;
const tokenOut = USDC_MARKET;
const txOrigin = web3WalletAddress;

const outputParams = await zap.getSwapExactTokensForTokensParams(
  tokenIn,
  amountIn,
  tokenOut,
  minAmountOut,
  txOrigin,
);

// You can now use outputParams for calling Dolomite's GenericTraderProxy or LiquidatorProxyV4 contracts
```

## Overview

