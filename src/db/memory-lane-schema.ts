import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const memoryLaneStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;
const status = [
  memoryLaneStatus.DRAFT,
  memoryLaneStatus.PUBLISHED,
  memoryLaneStatus.ARCHIVED,
] satisfies (typeof memoryLaneStatus)[keyof typeof memoryLaneStatus][];

export type MemoryLaneStatus = (typeof status)[number];
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
    .default(memoryLaneStatus.DRAFT)
    .$type<(typeof status)[number]>(),
});

export const memory = sqliteTable("memory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  memoryLaneId: text("memory_lane_id")
    .notNull()
    .references(() => memoryLane.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
});

export const memoryLaneRelations = relations(memoryLane, ({ one, many }) => ({
  user: one(user, {
    fields: [memoryLane.userId],
    references: [user.id],
  }),
  memories: many(memory),
}));

export const memoryRelations = relations(memory, ({ one }) => ({
  memoryLane: one(memoryLane, {
    fields: [memory.memoryLaneId],
    references: [memoryLane.id],
  }),
}));
