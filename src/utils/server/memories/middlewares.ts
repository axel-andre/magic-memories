"server-only";
import { createMiddleware } from "@tanstack/react-start";
import { getUserBySessionFn } from "../users/read";
import z from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db.node";
import { memoryLane } from "~/db/memory-lane-schema";
import { notFound } from "@tanstack/react-router";

export const assertMemoryLaneOwner = createMiddleware({
  type: "function",
})
  .inputValidator(
    z.object({
      memoryLaneId: z.string(),
    })
  )
  .server(async ({ data, next }) => {
    const user = await getUserBySessionFn();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const ml = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, data.memoryLaneId),
    });
    if (!ml) {
      throw notFound();
    }
    if (ml.userId !== user.id) {
      throw new Error("Unauthorized");
    }
    return next();
  });
