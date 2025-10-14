import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { updateMemorySchema } from "./schemas";
import { memory } from "~/db/memory-lane-schema";
import { assertMemoryLaneOwner } from "./middlewares";
import { notFound } from "@tanstack/react-router";
import { requireAuthed } from "../users/middlewares";

export const updateMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(updateMemorySchema)
  .handler(async ({ data, context }) => {
    try {
      console.log("data", data);
      const memo = await db.query.memory.findFirst({
        where: eq(memory.id, data.id!),
      });
      if (!memo) {
        console.log("memo not found");
        throw notFound();
      }
      const newValues = {
        content: data.content ?? memo.content,
        title: data.title ?? memo.title,
        date: data.date ? new Date(data.date) : memo.date,
      };
      console.log("newValues", newValues);
      const updatedMemory = await db
        .update(memory)
        .set(newValues)
        .where(eq(memory.id, data.id!))
        .returning();
      return updatedMemory;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update memory");
    }
  });
