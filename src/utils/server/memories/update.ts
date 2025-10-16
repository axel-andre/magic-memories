import { eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

import { memory, memoryLane } from "~/db/memory-lane-schema";

import { db } from "../db";
import { updateMemorySchema } from "./schemas";
import { requireAuthed } from "../users/middlewares";
import {
  NotFoundError,
  AuthorizationError,
  DatabaseError,
} from "~/utils/errors";

export const updateMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(updateMemorySchema)
  .middleware([requireAuthed])
  .handler(async ({ data, context }) => {
    try {
      const memo = await db.query.memory.findFirst({
        where: eq(memory.id, data.id!),
        with: {
          memoryLane: true,
        },
      });

      if (!memo) {
        throw new NotFoundError(
          `Memory with id ${data.id} not found`,
          "Memory not found"
        );
      }

      if (memo.memoryLane.userId !== context.user.id) {
        throw new AuthorizationError(
          `User ${context.user.id} attempted to update memory ${data.id} owned by ${memo.memoryLane.userId}`,
          "You don't have permission to update this memory"
        );
      }

      const newValues = {
        content: data.content ?? memo.content,
        title: data.title ?? memo.title,
        date: data.date ? new Date(data.date) : memo.date,
      };

      const updatedMemory = await db
        .update(memory)
        .set(newValues)
        .where(eq(memory.id, data.id!))
        .returning();

      return updatedMemory;
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof AuthorizationError
      ) {
        throw error;
      }
      throw new DatabaseError(
        "Failed to update memory in database",
        "Failed to update memory. Please try again.",
        {
          memoryId: data.id,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
  });
