type CacheItem<T> = {
  value: T;
  expiration: number;
};

export class LocalCache<T> {
  public readonly globalTTLSeconds: number;
  private data: Record<string, CacheItem<T>> = {};

  constructor(globalTTLSeconds: number) {
    this.globalTTLSeconds = globalTTLSeconds;
  }

  public set(key: string, value: T, ttlSeconds?: number): void {
    const expiration = Date.now() + ((ttlSeconds ?? this.globalTTLSeconds) * 1000);
    this.data[key] = { value, expiration };
  }

  public get(key: string): T | undefined {
    const item: CacheItem<T> | undefined = this.data[key];
    if (item?.expiration > Date.now()) {
      return item.value;
    }
    return undefined;
  }

  public remove(key: string): void {
    delete this.data[key];
  }

  public clear(): void {
    this.data = {};
  }
}
