import { createClient } from "redis";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Existing Node-Redis client
export const redisClient = createClient({
  url: REDIS_URL,
});

// Shared IORedis connection for BullMQ
export const ioRedisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

redisClient.on("connect", () => {
  console.log("🔴 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis ready");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};