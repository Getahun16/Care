import { PrismaClient } from "../../generated/prisma/client";

// Singleton pattern — prevent multiple Prisma Client instances in dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrismaClient> | undefined;
};

function makePrismaClient() {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  });
}

// Always create a fresh client in production; reuse singleton in dev
const prisma =
  process.env.NODE_ENV === "production"
    ? makePrismaClient()
    : (globalForPrisma.prisma ?? (globalForPrisma.prisma = makePrismaClient()));

export default prisma;
