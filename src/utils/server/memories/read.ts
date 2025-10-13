"server-only";
import { db } from "../db";
import { memoryLane } from "~/db/memory-lane-schema";
import { auth } from "../auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { paginationSchema, memoryIdSchema } from "./schemas";

export const getUserMemoriesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const memories = await db.query.memoryLane.findMany({
      where: eq(memoryLane.userId, session.user.id),
      with: {
        user: true,
      },
    });
    return memories;
  }
);

export const getAllMemoriesFnPaginated = createServerFn({
  method: "GET",
})
  .inputValidator(paginationSchema)
  .handler(async ({ data }) => {
    const { page, limit } = data;
    const offset = (page - 1) * limit;
    const memories = await db.query.memoryLane.findMany({
      with: {
        user: true,
      },
      where: eq(memoryLane.status, "published"),
      limit,
      offset,
    });
    return memories;
  });

export const getMemoryByIdFn = createServerFn({ method: "GET" })
  .inputValidator(memoryIdSchema)
  .handler(async ({ data }) => {
    const { id } = data;
    const memory = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, id),
      with: {
        user: true,
      },
    });
    return memory;
  });

