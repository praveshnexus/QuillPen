import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    console.log("🟡 Connecting to PostgreSQL...");

    await prisma.$connect();

    console.log("🟢 PostgreSQL connected.");
  } catch (error) {
    console.error("🔴 PostgreSQL connection failed.");
    console.error(error);

    process.exit(1);
  }
};

export default prisma;