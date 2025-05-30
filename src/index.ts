/*

    Copyright 2023 Dolomite.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export { DolomiteZap } from './DolomiteZap';
export { BigNumber };
export * from './lib/ApiTypes';
export { INTEGERS, DOLOMITE_API_SERVER_URL } from './lib/Constants';
export { ISOLATION_MODE_CONVERSION_MARKET_ID_MAP, LIQUIDITY_TOKEN_CONVERSION_MARKET_ID_MAP } from './lib/MarketIds';
