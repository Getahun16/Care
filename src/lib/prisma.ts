import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Singleton pattern — prevent multiple Prisma Client instances in dev (hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrismaClient> | undefined;
};

/**
 * Strip Prisma-engine-only URL parameters that pg.Pool doesn't understand.
 * Passing ?pgbouncer=true&connection_limit=1 to PostgreSQL causes P1001/P1017.
 */
function cleanDatabaseUrl(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.delete("pgbouncer");
  parsed.searchParams.delete("connection_limit");
  return parsed.toString();
}

function makePrismaClient() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Add it to Vercel: Settings → Environment Variables."
    );
  }
  const pool = new Pool({
    connectionString: cleanDatabaseUrl(rawUrl),
    ssl: { rejectUnauthorized: false },
    max: 1,
    min: 0,
    idleTimeoutMillis: 1,       // destroy connection immediately after release
    connectionTimeoutMillis: 30000,
    allowExitOnIdle: true,
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
