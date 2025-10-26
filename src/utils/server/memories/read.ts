"server-only";
import { z } from "zod";
import { eq, and, desc, asc, ne } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { memory, memoryLane } from "~/db/memory-lane-schema";

import { db } from "../db";
import { auth } from "../auth";

import { paginationSchema, memoryLaneIdSchema } from "./schemas";
import { checkAuthOrPublic } from "../users/middlewares";
import { notFound } from "@tanstack/react-router";
import { AuthorizationError } from "~/utils/errors";

export const getUserMemoriesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw new AuthorizationError(
        "Unauthorized",
        "You must be logged in to get your memories"
      );
    }

    const memories = await db.query.memoryLane.findMany({
      where: and(
        eq(memoryLane.userId, session.user.id),
        eq(memoryLane.status, "published")
      ),
      with: {
        user: true,
      },
      orderBy: [desc(memoryLane.updatedAt)],
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
    const { page, limit, status } = data;
    const offset = (page - 1) * limit;

    const whereCondition = status
      ? eq(memoryLane.status, status)
      : eq(memoryLane.status, "published");

    const memoryLanes = await db.query.memoryLane.findMany({
      with: {
        user: true,
        memories: true,
      },
      where: whereCondition,
      orderBy: [desc(memoryLane.updatedAt)],
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
        memories: {
          orderBy: [asc(memory.date)],
        },
      },
    });
    if (!memoryL) {
      throw notFound();
    }
    if (memoryL.status === "archived") {
      throw notFound();
    }
    if (memoryL?.memories) {
      memoryL.memories = convertMemoryImagesToUrls(memoryL.memories);
    }
    return memoryL;
  });

export const getUserMemoriesFnPaginated = createServerFn({
  method: "GET",
})
  .middleware([checkAuthOrPublic])
  .inputValidator(paginationSchema.extend({ userId: z.string() }))
  .handler(async ({ data, context }) => {
    const { page, limit, userId } = data;

    const offset = (page - 1) * limit;
    const whereCondtions = [
      eq(memoryLane.userId, userId),
      ne(memoryLane.status, "archived"),
    ];
    if (context.user?.id !== userId) {
      whereCondtions.push(eq(memoryLane.status, "published"));
    }
    const memoryLanes = await db.query.memoryLane.findMany({
      with: {
        user: true,
        memories: true,
      },
      orderBy: [desc(memoryLane.updatedAt)],
      where: and(...whereCondtions),
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
