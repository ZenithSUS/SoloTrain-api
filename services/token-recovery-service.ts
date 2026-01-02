import redis from "../lib/redis.js";

interface TokenAccount {
  email: string;
  token: string;
}

class TokenRecoveryService {
  private static CACHE_TIME = 60 * 60; // 1 hour

  private static getCacheKey(token: string): string {
    return `email-token:${token}`;
  }

  static async saveToken(
    token: string,
    tokenData: TokenAccount
  ): Promise<void> {
    // Save the token with a 24-hour expiration
    const cacheKey = this.getCacheKey(token);
    await redis.setex(cacheKey, this.CACHE_TIME, JSON.stringify(tokenData));
  }

  static async getToken(token: string): Promise<TokenAccount | null> {
    // Get the token from Redis
    const cacheKey = this.getCacheKey(token);
    return await redis.get(cacheKey);
  }

  static async deleteToken(token: string): Promise<void> {
    // Delete the token from Redis
    const cacheKey = this.getCacheKey(token);
    await redis.del(cacheKey);
  }

  static async getExpirationTime(token: string): Promise<number | null> {
    // Get the expiration time from Redis
    const cacheKey = this.getCacheKey(token);
    return await redis.ttl(cacheKey);
  }

  static async deleteAllTokens(): Promise<void> {
    await redis.flushall();
  }
}

export default TokenRecoveryService;
