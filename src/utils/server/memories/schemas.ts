import { z } from "zod";

export interface CreateMemoryInput {
  name: string;
}

const memoryLaneNameSchema = z.string().min(3).max(100);

export const createMemoryLaneSchema = z.object({
  name: memoryLaneNameSchema,
});

export const memoryTitleSchema = z
  .string()
  .min(1, "Title is required")
  .min(3, "Title must be at least 3 characters")
  .max(50, "Title must be less than 50 characters");

export const memoryContentSchema = z
  .string()
  .min(1, "Description is required")
  .min(10, "Description must be at least 10 characters")
  .max(500, "Description must be less than 500 characters");

export const memoryDateSchema = z.string().refine((date) => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}, "Valid date is required");

// Client-side: validates File objects in the browser
export const memoryImageFileSchema = z
  .custom<File | null>()
  .refine((file) => file !== null, "Image is required")
  .refine((file) => {
    if (!file) return false;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    return file.size <= MAX_FILE_SIZE;
  }, "Image size must be less than 5MB")
  .refine((file) => {
    if (!file) return false;
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return ALLOWED_TYPES.includes(file.type);
  }, "Image must be JPEG, PNG, GIF, or WebP");

// Server-side: validates file data sent to API (base64 encoded)
const serverFileSchema = z
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
  );

function createFieldValidator<T>(schema: z.ZodType<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      return result.error.issues[0]?.message;
    }
    return undefined;
  };
}

export const memoryFormSchema = z.object({
  title: memoryTitleSchema,
  content: memoryContentSchema,
  date: memoryDateSchema,
  image: memoryImageFileSchema,
});

export const memoryTitleValidator = createFieldValidator(memoryTitleSchema);
export const memoryContentValidator = createFieldValidator(memoryContentSchema);
export const memoryDateValidator = createFieldValidator(memoryDateSchema);
export const memoryImageValidator = createFieldValidator(memoryImageFileSchema);

export const memoryFormValidator = ({
  value,
}: {
  value: z.infer<typeof memoryFormSchema>;
}) => {
  const result = memoryFormSchema.safeParse(value);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    });
    return {
      fields: fieldErrors,
      form: "Please fix all validation errors before submitting",
    };
  }
  return undefined;
};

export const paginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const memoryLaneIdSchema = z.object({
  id: z.string(),
});

// Server-side schema for creating memories (used by API)
export const createMemorySchema = z.object({
  memoryLaneId: z.string(),
  title: memoryTitleSchema,
  content: memoryContentSchema,
  date: memoryDateSchema,
  file: serverFileSchema,
});

export type CreateMemorySchema = z.infer<typeof createMemorySchema>;

export const updateMemorySchema = z.object({
  id: z.string(),
  title: memoryTitleSchema.optional(),
  content: memoryContentSchema.optional(),
  date: memoryDateSchema.optional(),
  file: serverFileSchema.optional(),
});

const memoryLaneStatusSchema = z.enum(["draft", "published", "archived"]);
export type MemoryLaneStatus = z.infer<typeof memoryLaneStatusSchema>;

export const updateMemoryLaneSchema = z.object({
  id: z.string(),
  name: memoryLaneNameSchema.optional(),
  status: memoryLaneStatusSchema.optional(),
});

export const publishMemoryLaneSchema = z.object({
  id: z.string(),
});
