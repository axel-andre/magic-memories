"server-only";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireAuthed } from "../users/middlewares";
import { assertMemoryLaneOwner } from "./middlewares";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { memory, memoryLane } from "~/db/memory-lane-schema";

export const deleteMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ memoryLaneId: z.string() }))
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data }) => {
    try {
      await db.delete(memoryLane).where(eq(memoryLane.id, data.memoryLaneId));
    } catch (error) {
      throw new Error("Failed to delete memory lane");
    }
  });

export const deleteMemoryFn = createServerFn()
  .inputValidator(z.object({ memoryId: z.string() }))
  .middleware([assertMemoryLaneOwner])
  .handler(async ({ data }) => {
    try {
      await db.delete(memory).where(eq(memory.id, data.memoryId));
    } catch (error) {
      throw new Error("Failed to delete memory");
    }
  });
