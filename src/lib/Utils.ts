import { ethers } from 'ethers';
import { Address, ZapOutputParam } from './ApiTypes';

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function toChecksumOpt(address: Address): Address | undefined {
  if (!address) {
    return undefined;
  }

  try {
    return ethers.utils.getAddress(address);
  } catch (e) {
    return undefined;
  }
}

export function removeDuplicates<T>(values: T[], hashFn: (value: T) => string): T[] {
  const seen = new Set<string>();
  return values.filter(value => {
    const hash = hashFn(value);
    if (seen.has(hash)) {
      return false;
    }
    seen.add(hash);
    return true;
  });
}

export function zapOutputParamToJson(param: ZapOutputParam): string {
  return JSON.stringify({
    marketIdsPath: param.marketIdsPath,
    amountWeisPath: param.amountWeisPath.map(wei => wei.toFixed()),
    traderParams: param.traderParams,
    makerAccounts: param.makerAccounts,
  });
}
