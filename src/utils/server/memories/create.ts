"server-only";
import { db } from "../db";
import { memoryLane, memory } from "~/db/memory-lane-schema";
import { auth } from "../auth";
import { requireAuthed } from "../users/middlewares";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { createMemoryLaneSchema, createMemorySchema } from "./schemas";
import { notFound } from "@tanstack/react-router";
import { imageStorage } from "../services/imageStorage";

export const createMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(createMemoryLaneSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const newMemory = await db
      .insert(memoryLane)
      .values({
        name: data.name,
        status: "draft",
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    const ml = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, newMemory[0].id),
      with: {
        user: true,
      },
    });

    return newMemory[0];
  });
export const createMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(createMemorySchema)
  .middleware([requireAuthed])
  .handler(async ({ data, context }) => {
    const user = context.user;
    const ml = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.memoryLaneId),
    });
    if (!ml) {
      throw notFound();
    }
    if (ml.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    const fileBuffer = Uint8Array.from(atob(data.file.data), (c) =>
      c.charCodeAt(0)
    );
    const timestamp = Date.now();
    const randomStr = crypto.randomUUID().split("-")[0];
    const fileExtension = data.file.name.split(".").pop();
    const uniqueFileName = `${data.memoryLaneId}/${timestamp}-${randomStr}.${fileExtension}`;

    const image = await imageStorage.store(
      fileBuffer,
      uniqueFileName,
      {
        contentType: data.file.type,
      },
      {
        memoryLaneId: data.memoryLaneId,
        originalName: data.file.name,
        uploadedBy: user.id,
      }
    );
    const newMemory = await db
      .insert(memory)
      .values({
        memoryLaneId: data.memoryLaneId,
        title: data.title,
        content: data.content,
        date: new Date(data.date),
        image: image.key,
      })
      .returning();
    return newMemory[0];
  });