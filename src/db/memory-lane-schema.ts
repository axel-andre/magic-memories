import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

const status = ["draft", "published", "archived"] as const;
export const memoryLane = sqliteTable("memory_lane", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status")
    .notNull()
    .default("draft")
    .$type<(typeof status)[number]>(),
});
export const memoryLaneRelations = relations(memoryLane, ({ one }) => ({
  user: one(user, {
    fields: [memoryLane.userId],
    references: [user.id],
  }),
}));
