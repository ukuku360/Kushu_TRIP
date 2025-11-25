class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  async waitForToken(key = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requestTimes = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requestTimes.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const waitTime = oldestRequest + this.windowMs - now;
      
      if (waitTime > 0) {
        console.log(`⏳ Rate limit hit for ${key}, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForToken(key);
      }
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

// API-specific rate limiters
export const googlePlacesLimiter = new RateLimiter(10, 60000); // 10 requests per minute
export const geminiLimiter = new RateLimiter(15, 60000); // 15 requests per minute  
export const braveLimiter = new RateLimiter(20, 60000); // 20 requests per minute

export default RateLimiter; 