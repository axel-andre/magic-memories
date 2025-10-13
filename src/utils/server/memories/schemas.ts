import { z } from "zod";

export interface CreateMemoryInput {
  name: string;
}

export const createMemorySchema = z.object({
  name: z.string().min(3).max(100),
});

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
});

export const memoryIdSchema = z.object({
  id: z.string(),
});

