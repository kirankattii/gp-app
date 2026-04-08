import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma"; // ← your generated client

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
// Create PostgreSQL adapter
const adapter = new PrismaPg({
  connectionString,
});

// Create Prisma client with adapter
export const prisma = new PrismaClient({
  adapter,
});