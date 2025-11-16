import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Debug: Log database connection details
const dbUrlForLog = env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
console.log("🔌 Database connection:", dbUrlForLog);

// Reuse existing connection if available (for HMR in development)
const conn = globalForDb.conn ?? postgres(env.DATABASE_URL, {
  max: 10, // Allow multiple connections for concurrent requests
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // Suppress notices
});

if (env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
