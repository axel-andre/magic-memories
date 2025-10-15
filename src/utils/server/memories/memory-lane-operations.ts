"server-only";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { notFound } from "@tanstack/react-router";
import { requireAuthed } from "../users/middlewares";
import { assertMemoryLaneOwner } from "./middlewares";
import { db } from "../db";
import { memoryLane } from "~/db/memory-lane-schema";
import { updateMemoryLaneSchema, publishMemoryLaneSchema } from "./schemas";

export const updateMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(updateMemoryLaneSchema)
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data, context }) => {
    const user = context.user;

    // Verify the memory lane exists and user owns it
    const existingMemoryLane = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.id),
    });

    if (!existingMemoryLane) {
      throw notFound();
    }

    if (existingMemoryLane.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    // Prepare update data
    const updateData: Partial<typeof memoryLane.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const updatedMemoryLane = await db
      .update(memoryLane)
      .set(updateData)
      .where(eq(memoryLane.id, data.id))
      .returning();

    return updatedMemoryLane[0];
  });

export const publishMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(publishMemoryLaneSchema)
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data, context }) => {
    const user = context.user;

    // Verify the memory lane exists and user owns it
    const existingMemoryLane = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.id),
      with: {
        memories: true,
      },
    });

    if (!existingMemoryLane) {
      throw notFound();
    }

    if (existingMemoryLane.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    // Check if memory lane has at least one memory before publishing
    if (
      !existingMemoryLane.memories ||
      existingMemoryLane.memories.length === 0
    ) {
      throw new Error("Cannot publish a memory lane without any memories");
    }

    const updatedMemoryLane = await db
      .update(memoryLane)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(eq(memoryLane.id, data.id))
      .returning();

    return updatedMemoryLane[0];
  });

export const unpublishMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(publishMemoryLaneSchema)
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data, context }) => {
    const user = context.user;

    // Verify the memory lane exists and user owns it
    const existingMemoryLane = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.id),
    });

    if (!existingMemoryLane) {
      throw notFound();
    }

    if (existingMemoryLane.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    const updatedMemoryLane = await db
      .update(memoryLane)
      .set({
        status: "draft",
        updatedAt: new Date(),
      })
      .where(eq(memoryLane.id, data.id))
      .returning();

    return updatedMemoryLane[0];
  });

export const archiveMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(publishMemoryLaneSchema)
  .middleware([requireAuthed, assertMemoryLaneOwner])
  .handler(async ({ data, context }) => {
    const user = context.user;

    // Verify the memory lane exists and user owns it
    const existingMemoryLane = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.id),
    });

    if (!existingMemoryLane) {
      throw notFound();
    }

    if (existingMemoryLane.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    const updatedMemoryLane = await db
      .update(memoryLane)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(memoryLane.id, data.id))
      .returning();

    return updatedMemoryLane[0];
  });
