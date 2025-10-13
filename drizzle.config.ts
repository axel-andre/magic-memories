import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";

const baseConfig = {
  out: "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
} as const;

export default defineConfig({
  ...baseConfig,
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
