import { Redis } from "ioredis";
import { config } from "../config.js";

export const redis = new Redis(config.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

redis.on("error", (error: Error) => {
  console.error("Redis connection error:", error.message);
});

export async function getRedisClient() {
  if (redis.status === "wait" || redis.status === "close") {
    await redis.connect();
  }

  return redis;
}
