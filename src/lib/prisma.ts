import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Singleton pattern — prevent multiple Prisma Client instances in dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrismaClient> | undefined;
};

function makePrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Add it to Vercel: Settings → Environment Variables."
    );
  }
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Always create a fresh client in production; reuse singleton in dev
const prisma =
  process.env.NODE_ENV === "production"
    ? makePrismaClient()
    : (globalForPrisma.prisma ?? (globalForPrisma.prisma = makePrismaClient()));

export default prisma;
