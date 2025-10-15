"server-only";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "../db";
import { memory } from "~/db/memory-lane-schema";
import { eq } from "drizzle-orm";
import { requireAuthed } from "../users/middlewares";
import { assertMemoryLaneOwner } from "./middlewares";

export const deleteMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ memoryLaneId: z.string() }))
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data }) => {
    await db.delete(memory).where(eq(memory.id, data.memoryLaneId));
  });

export const deleteMemoryFn = createServerFn()
  .inputValidator(z.object({ memoryId: z.string() }))
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data }) => {
    await db.delete(memory).where(eq(memory.id, data.memoryId));
  });
