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
    max: 2,
    min: 0,                    // don't hold idle connections open
    idleTimeoutMillis: 5000,   // destroy idle connections after 5s (before pgbouncer/firewall drops them)
    connectionTimeoutMillis: 30000,
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
