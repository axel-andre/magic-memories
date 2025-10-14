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
});

export const memoryLaneIdSchema = z.object({
  id: z.string(),
});

export const createMemorySchema = z.object({
  memoryLaneId: z.string(),
  title: z.string().min(3).max(100),
  content: z.string().min(3).max(1000),
  date: z.string(), // ISO date string
  file: z.object({
    data: z.string(), // base64 encoded file data
    type: z.string(), // MIME type
    name: z.string(), // file name
    size: z.number(), // file size in bytes
  }),
});

export const updateMemorySchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100).optional(),
  content: z.string().min(3).max(1000).optional(),
  date: z.string().optional(), // ISO date string
  file: z
    .object({
      data: z.string(), // base64 encoded file data
      type: z.string(), // MIME type
      name: z.string(), // file name
      size: z.number(), // file size in bytes
    })
    .optional(),
});
