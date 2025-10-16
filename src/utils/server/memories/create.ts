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
import { validateImageFile, validateDecodedFileSize } from "~/utils/validation";
import {
  ValidationError,
  FileUploadError,
  DatabaseError,
  AuthorizationError,
} from "~/utils/errors";

export const createMemoryLaneFn = createServerFn({ method: "POST" })
  .inputValidator(createMemoryLaneSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw new AuthorizationError(
        "Unauthorized",
        "You must be logged in to create a memory lane"
      );
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
      throw new AuthorizationError(
        "Unauthorized",
        "You don't have permission to create a memory in this memory lane"
      );
    }

    const fileValidation = validateImageFile(data.file);
    if (!fileValidation.isValid) {
      throw new ValidationError(
        `File validation failed: ${fileValidation.error}`,
        fileValidation.error || "Invalid file",
        { file: data.file.name, type: data.file.type, size: data.file.size }
      );
    }

    const fileBuffer = Uint8Array.from(atob(data.file.data), (c) =>
      c.charCodeAt(0)
    );

    const sizeValidation = validateDecodedFileSize(
      fileBuffer.length,
      data.file.size
    );
    if (!sizeValidation.isValid) {
      throw new FileUploadError(
        `File size validation failed: ${sizeValidation.error}`,
        sizeValidation.error || "File size mismatch",
        { reportedSize: data.file.size, actualSize: fileBuffer.length }
      );
    }
    const timestamp = Date.now();
    const randomStr = crypto.randomUUID().split("-")[0];
    const fileExtension = data.file.name.split(".").pop();
    const uniqueFileName = `${data.memoryLaneId}/${timestamp}-${randomStr}.${fileExtension}`;

    let image;
    try {
      image = await imageStorage.store(
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
    } catch (error) {
      throw new FileUploadError(
        "Failed to store image",
        "Failed to upload image. Please try again.",
        {
          fileName: uniqueFileName,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
    try {
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
    } catch (error) {
      throw new DatabaseError(
        "Failed to create memory in database",
        "Failed to save memory. Please try again.",
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  });