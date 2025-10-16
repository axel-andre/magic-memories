"server-only";
import { z } from "zod";

export interface CreateMemoryInput {
  name: string;
}

export const createMemoryLaneSchema = z.object({
  name: z.string().min(3).max(100),
});

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const memoryLaneIdSchema = z.object({
  id: z.string(),
});

export const createMemorySchema = z.object({
  memoryLaneId: z.string(),
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(1000),
  date: z.string(),
  file: z
    .object({
      data: z.string(),
      type: z.string(),
      name: z.string(),
      size: z.number(),
    })
    .refine(
      (file) => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        return file.size <= MAX_FILE_SIZE;
      },
      {
        message: "File size must be less than 5MB",
      }
    )
    .refine(
      (file) => {
        const ALLOWED_TYPES = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        return ALLOWED_TYPES.includes(file.type);
      },
      {
        message: "File type must be JPEG, PNG, GIF, or WebP",
      }
    ),
});

export const updateMemorySchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(3).max(1000).optional(),
  date: z.string().optional(),
  file: z
    .object({
      data: z.string(),
      type: z.string(),
      name: z.string(),
      size: z.number(),
    })
    .optional(),
});

export const updateMemoryLaneSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(100).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const publishMemoryLaneSchema = z.object({
  id: z.string(),
});
