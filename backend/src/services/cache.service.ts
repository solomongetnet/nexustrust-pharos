import { redisClient } from "../config/redis.config.js";

/**
 * Professional Cache Service
 * Handles Redis operations with graceful error handling
 */
export const cacheService = {
  /**
   * Set cache with TTL
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      const data = JSON.stringify(value);
      await redisClient.setEx(key, ttl, data);
    } catch (error) {
      console.error(`[CacheService] Error setting key ${key}:`, error);
    }
  },

  /**
   * Get cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!redisClient.isOpen) return null;
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[CacheService] Error getting key ${key}:`, error);
      return null;
    }
  },

  /**
   * Delete specific cache key
   */
  async del(key: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      await redisClient.del(key);
    } catch (error) {
      console.error(`[CacheService] Error deleting key ${key}:`, error);
    }
  },

  /**
   * Delete multiple keys by pattern
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      if (!redisClient.isOpen) return;
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`[CacheService] Error deleting pattern ${pattern}:`, error);
    }
  },
};

/**
 * Professional Cache Key Generator
 */
export const getTodoCacheKey = (id?: string) => {
  return id ? `todo:item:${id}` : `todo:all`;
};
