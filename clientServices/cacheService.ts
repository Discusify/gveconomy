// services/GlobalCache.ts

type Timer = ReturnType<typeof setTimeout>;

class GlobalCacheClass {
  private _store: Map<string, unknown> = new Map();
  private _timers: Map<string, Timer> = new Map();

  get<T = unknown>(key: string): T | null {
    return this._store.has(key) ? (this._store.get(key) as T) : null;
  }

  /**
   * Guarda un valor con un tiempo de expiración opcional (en milisegundos).
   */
  set<T = unknown>(key: string, data: T, ttlMs: number = 240000): void {
    this._store.set(key, data);

    // limpiar timer previo
    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key)!);
      this._timers.delete(key);
    }

    if (typeof ttlMs === "number" && ttlMs > 0) {
      const timer = setTimeout(() => {
        this._store.delete(key);
        this._timers.delete(key);
      }, ttlMs);

      this._timers.set(key, timer);
    }
  }

  has(key: string): boolean {
    return this._store.has(key);
  }

  delete(key: string): void {
    this._store.delete(key);

    if (this._timers.has(key)) {
      clearTimeout(this._timers.get(key)!);
      this._timers.delete(key);
    }
  }

  clear(): void {
    this._store.clear();

    for (const timer of this._timers.values()) {
      clearTimeout(timer);
    }

    this._timers.clear();
  }
}

class PersistentGlobalCacheClass {
  private _store: Map<string, unknown> = new Map();

  get<T = unknown>(key: string): T | null {
    return this._store.has(key) ? (this._store.get(key) as T) : null;
  }

  set<T = unknown>(key: string, data: T): void {
    this._store.set(key, data);
  }

  has(key: string): boolean {
    return this._store.has(key);
  }

  delete(key: string): void {
    this._store.delete(key);
  }

  clear(): void {
    this._store.clear();
  }
}

// Instancias (simulan tu objeto original)
const GlobalCache = new GlobalCacheClass();
const PersistentGlobalCache = new PersistentGlobalCacheClass();

export { PersistentGlobalCache };
export default GlobalCache;