class APICache {
  constructor(defaultTTL = 300000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${url}?${sortedParams}`;
  }

  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
    console.log(`💾 Cached: ${key.substring(0, 50)}...`);
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      console.log(`🗑️ Expired cache: ${key.substring(0, 50)}...`);
      return null;
    }

    console.log(`⚡ Cache hit: ${key.substring(0, 50)}...`);
    return cached.data;
  }

  clear() {
    this.cache.clear();
    console.log('🧹 Cache cleared');
  }

  size() {
    return this.cache.size;
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
    }
  }
}

// Global cache instances
export const placesCache = new APICache(900000); // 15 minutes for places
export const reviewsCache = new APICache(1800000); // 30 minutes for reviews
export const geminiCache = new APICache(3600000); // 1 hour for AI responses
export const searchCache = new APICache(600000); // 10 minutes for search results

// Auto cleanup every 5 minutes
setInterval(() => {
  placesCache.cleanup();
  reviewsCache.cleanup(); 
  geminiCache.cleanup();
  searchCache.cleanup();
}, 300000);

export default APICache; 