"server-only";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireAuthed } from "../users/middlewares";
import { assertMemoryLaneOwner } from "./middlewares";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { memory, memoryLane } from "~/db/memory-lane-schema";
import { notFound } from "@tanstack/react-router";
import { AuthorizationError, DatabaseError } from "~/utils/errors";

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
  .middleware([requireAuthed])
  .handler(async ({ data, context }) => {
    try {
      const mem = await db.query.memory.findFirst({
        where: eq(memory.id, data.memoryId),
        with: {
          memoryLane: true,
        },
      });

      if (!mem) {
        throw notFound();
      }

      if (mem.memoryLane.userId !== context.user.id) {
        throw new AuthorizationError("Unauthorized: You don't own this memory");
      }

      await db.delete(memory).where(eq(memory.id, data.memoryId));
    } catch (error) {
      throw new DatabaseError(
        "Failed to delete memory",
        "Failed to delete memory. Please try again."
      );
    }
  });
