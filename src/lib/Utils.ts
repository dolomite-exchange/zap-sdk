import { ethers } from 'ethers';
import { Address, ZapOutputParam } from './ApiTypes';
import { INTEGERS } from './Constants';

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function toChecksumOpt(address: Address | undefined): Address | undefined {
  if (!address) {
    return undefined;
  }

  try {
    return ethers.utils.getAddress(address);
  } catch (e) {
    return undefined;
  }
}

export function toChecksumReq(address: Address): Address {
  return ethers.utils.getAddress(address);
}

/**
 * @param values    The values to scan
 * @param hashFn    A function that resolves some value <T> to a string that can be used in a Set. Duplicates will be
 *                  filtered out.
 * @param invalidFn A function that resolves some value <T> to true if it's considered invalid and should be filtered
 *                  out.
 */
export function removeDuplicatesAndInvalids<T>(
  values: T[],
  hashFn: (value: T) => string,
  invalidFn: (value: T) => boolean,
): T[] {
  const seen = {};
  return values.filter(value => {
    const hash = hashFn(value);
    if (seen[hash] || invalidFn(value)) {
      return false;
    }
    seen[hash] = true;
    return true;
  });
}

export function zapOutputParamIsInvalid(value: ZapOutputParam): boolean {
  return value.amountWeisPath.some(p => p.eq(INTEGERS.NEGATIVE_ONE));
}
