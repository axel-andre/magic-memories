"server-only";
import { drizzle } from "drizzle-orm/better-sqlite3";
// @ts-ignore
import Database from "better-sqlite3";
import * as schema from "~/db/schema";

// This is a mock database instance used only for Better Auth CLI schema generation
// It won't actually connect to your D1 database
const sqlite = new Database(":memory:");
export const db = drizzle(sqlite, { schema });
