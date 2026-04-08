import "dotenv/config";
import app from "./app";
import { prisma } from "./config/prisma";
import logger from "./config/logger";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);

  try {
    await prisma.$connect();
    logger.info("📦 Connected to PostgreSQL using Prisma 7 adapter");
  } catch (err) {
    logger.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  }
});