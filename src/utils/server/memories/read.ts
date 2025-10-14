"server-only";
import { db } from "../db";
import { memoryLane } from "~/db/memory-lane-schema";
import { auth } from "../auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { paginationSchema, memoryLaneIdSchema } from "./schemas";

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
export const convertMemoryImagesToUrls = <T extends { image: string }>(
  memories: T[]
): T[] => {
  return memories.map((memory) => {
    return {
      ...memory,
      image: `/api/files/${memory.image}`,
    };
  });
};
export const getAllMemoriesFnPaginated = createServerFn({
  method: "GET",
})
  .inputValidator(paginationSchema)
  .handler(async ({ data }) => {
    const { page, limit } = data;
    const offset = (page - 1) * limit;
    const memoryLanes = await db.query.memoryLane.findMany({
      with: {
        user: true,
        memories: true,
      },
      where: eq(memoryLane.status, "published"),
      limit,
      offset,
    });
    memoryLanes.map((memoryLane) => {
      if (memoryLane.memories) {
        memoryLane.memories = convertMemoryImagesToUrls(memoryLane.memories);
      }
    });
    return memoryLanes;
  });

export const getMemoryByIdFn = createServerFn({ method: "GET" })
  .inputValidator(memoryLaneIdSchema)
  .handler(async ({ data }) => {
    const { id } = data;
    const memoryL = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, id),
      with: {
        user: true,
        memories: true,
      },
    });
    if (memoryL?.memories) {
      memoryL.memories = convertMemoryImagesToUrls(memoryL.memories);
    }
    return memoryL;
  });

