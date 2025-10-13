"server-only";
import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";

import * as schema from "~/db/schema";
const getDb = () => {
  if (!env.db_app) {
    throw new Error("db_app is not set");
  }
  return env.db_app;
};
export const db = drizzle(getDb(), {
  schema,
});
