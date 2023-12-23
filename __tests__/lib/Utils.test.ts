import { removeDuplicatesAndInvalids, toChecksumOpt } from '../../src/lib/Utils';

describe('Utils', () => {
  describe('#toChecksumOpt', () => {
    it('should work normally', () => {
      expect(toChecksumOpt('0x34df4e8062a8c8ae97e3382b452bd7bf60542698'))
        .toEqual('0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698');

      expect(toChecksumOpt('0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698'))
        .toEqual('0x34DF4E8062A8C8Ae97E3382B452bd7BF60542698');
    });

    it('should fail when a malformed address is passed in', () => {
      expect(toChecksumOpt('')).toBeUndefined();
      expect(toChecksumOpt(undefined)).toBeUndefined();
      expect(toChecksumOpt('0x')).toBeUndefined();
      expect(toChecksumOpt('0x123123123123123')).toBeUndefined();
      expect(toChecksumOpt('0x1234567812345678123456781234567812345678123456781234567812345678')).toBeUndefined();
    });
  });

  describe('#removeDuplicates', () => {
    const hash = (v: number) => v.toString();
    const invalid = (v: number) => v === 4;

    it('should work normally', () => {
      expect(removeDuplicatesAndInvalids([1, 2, 3], hash, invalid)).toEqual([1, 2, 3]);
      expect(removeDuplicatesAndInvalids([1, 1, 1], hash, invalid)).toEqual([1]);
      expect(removeDuplicatesAndInvalids([1, 2, 1, 4], hash, invalid)).toEqual([1, 2]);
      expect(removeDuplicatesAndInvalids([] as number[], hash, invalid)).toEqual([]);
    });
  });
});
