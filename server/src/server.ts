import dotenv from "dotenv";
dotenv.config()

import app from "./app";
import { connectRedis } from "./config/redis";


const PORT =process.env.PORT ||  5000;

// Fire-and-forget: Redis is a cache, not a dependency. The API must start
// and accept requests on schedule whether or not Redis is reachable yet -
// awaiting this here would tie server startup time to Redis's availability,
// which defeats the point of graceful degradation.
import { connectDB } from "./config/prisma";

const startServer = async () => {
  console.log("\n════════════════════════════════════");
  console.log("🚀 Starting QuillPen API");
  console.log("════════════════════════════════════\n");

  await connectDB();

  await connectRedis();

  app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🌐 Server running on port ${PORT}`);
  console.log("✅ QuillPen API started successfully.\n");
});
};

startServer();