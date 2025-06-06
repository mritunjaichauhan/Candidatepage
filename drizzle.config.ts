import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/worker/schema.ts",
  out: "./src/worker/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}); 