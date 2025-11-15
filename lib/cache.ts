
type CacheEntry<T> = { value: T; expiresAt: number };

export class SimpleCache {
  private store = new Map<string, CacheEntry<any>>();

  constructor(private defaultTtlMs = 15000) {} // default 15s

  get<T>(key: string): T | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return e.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
  }

  del(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

// export a single shared instance for app use
export const cache = new SimpleCache(15000);
