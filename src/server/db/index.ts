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
console.log("🔍 Full URL length:", env.DATABASE_URL.length);
console.log("🔍 URL starts with:", env.DATABASE_URL.substring(0, 30));
console.log("🔍 URL contains 'password':", env.DATABASE_URL.includes('password'));

// Close existing connection if it exists (to force fresh connection)
if (globalForDb.conn) {
  console.log("🔄 Closing existing database connection to force refresh...");
  try {
    globalForDb.conn.end();
  } catch (e) {
    // Ignore errors when closing
  }
  globalForDb.conn = undefined;
}

// Create connection with explicit options to ensure correct authentication
const conn = postgres(env.DATABASE_URL, {
  max: 1, // Limit connections for debugging
  idle_timeout: 20,
  connect_timeout: 10,
});

// Test the connection immediately (fire and forget - will log if it fails)
conn`SELECT 1 as test`
  .then(() => {
    console.log("✅ Database connection test successful");
  })
  .catch((error) => {
    console.error("❌ Database connection test failed:", error.message);
    console.error("🔍 Error details:", JSON.stringify({
      code: error.code,
      severity: error.severity,
      detail: error.detail,
      hint: error.hint
    }, null, 2));
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
