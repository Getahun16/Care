import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load from .env.local first (Next.js convention), then fall back to .env
config({ path: ".env.local" });
config({ path: ".env" }); // fallback: Vercel / CI will already have DATABASE_URL in process.env

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL bypasses pgbouncer for migrate commands; falls back to DATABASE_URL
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
