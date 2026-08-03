import { createClient } from "redis";

// Redis is a performance layer, never the source of truth. Every setting
// below is chosen to make that true in practice, not just in theory:
// a reconnect strategy that keeps trying in the background, and error
// handling that logs instead of throwing.
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        // Stop retrying after 10 attempts so a permanently-down Redis
        // doesn't spam reconnect attempts forever. The app keeps running
        // in "no cache" mode; a container restart will try again fresh.
        console.error(
          "[Redis] Max reconnection attempts reached. Continuing without cache until next restart.",
        );
        return new Error("Redis max retries exceeded");
      }
      // Exponential-ish backoff, capped at 3s between attempts.
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("🟡 [Redis] TCP connection established.");
});

redisClient.on("ready", () => {
  console.log("🟢 [Redis] Ready to serve cache requests.");
});

redisClient.on("reconnecting", () => {
  console.log("🟠 [Redis] Reconnecting...");
});

redisClient.on("error", (error) => {
  console.error("🔴 [Redis] Client error:", error.message);
});

redisClient.on("end", () => {
  console.warn("⚫ [Redis] Connection closed.");
});

// This listener is not just logging - in Node.js, an EventEmitter that emits
// "error" with no listener attached throws and crashes the process. Having
// this handler at all is what prevents a Redis outage from taking the whole
// API down. Every individual cache read/write in utils/cache.ts ALSO wraps
// its call in try/catch as a second, independent layer of protection.
redisClient.on("error", (error) => {
  console.error("[Redis] Client error:", error.message);
});

redisClient.on("end", () => {
  console.warn("[Redis] Connection closed.");
});

/**
 * Attempts to connect to Redis once at startup. Deliberately does not throw:
 * if Redis is unreachable, the app must still start and serve requests
 * (reads simply fall back to the database - see utils/cache.ts). The
 * `reconnectStrategy` above keeps trying in the background afterwards.
 */
export const connectRedis = async (): Promise<void> => {
  console.log("🚀 Starting Redis connection...");

  try {
    await redisClient.connect();
    console.log("✅ Redis initialization completed.");
  } catch (error) {
    console.error(
      "❌ Redis initial connection failed. App will continue without cache:",
      (error as Error).message,
    );
  }
};

export default redisClient;
