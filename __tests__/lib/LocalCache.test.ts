import { LocalCache } from '../../src/lib/LocalCache';
import { delay } from '../../src/lib/Utils';

describe('LocalCache', () => {
  const ttlSeconds = 2;
  const cache = new LocalCache<number>(ttlSeconds);

  it('#get should work with different expirations', async () => {
    cache.set('key1', 42, 4); // Set an item with a TTL of 4 seconds
    expect(cache.get('key1')).toBe(42);

    cache.set('key2', 100);
    expect(cache.get('key2')).toBe(100);

    await delay(2100); // Wait 2.1 seconds

    expect(cache.get('key1')).toBe(42); // Item should still be in cache
    expect(cache.get('key2')).toBeUndefined(); // Item should have expired

    await delay(2000); // Wait 2 seconds

    expect(cache.get('key1')).toBeUndefined(); // Item should have expired
  });

  it('#remove and #clear should work', () => {
    cache.set('key1', 42);
    expect(cache.get('key1')).toBe(42);

    cache.set('key2', 100);
    expect(cache.get('key2')).toBe(100);

    cache.remove('key1');
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe(100);

    cache.clear();
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
  });
});
