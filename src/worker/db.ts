import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

export function createDB(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle({ client: pool });
} 