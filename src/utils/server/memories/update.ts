import { eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

import { memory } from "~/db/memory-lane-schema";

import { db } from "../db";
import { updateMemorySchema } from "./schemas";

export const updateMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(updateMemorySchema)
  .handler(async ({ data }) => {
    try {
      const memo = await db.query.memory.findFirst({
        where: eq(memory.id, data.id!),
      });
      if (!memo) {
        throw notFound();
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
      console.error(error);
      throw new Error("Failed to update memory");
    }
  });
