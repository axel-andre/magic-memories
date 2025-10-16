"server-only";
import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { requireAuthed } from "../users/middlewares";
import { db } from "../db";
import { memoryLane } from "~/db/memory-lane-schema";
import { eq } from "drizzle-orm";
import { AuthorizationError } from "~/utils/errors";
import { notFound } from "@tanstack/react-router";

export const assertMemoryLaneOwner = createMiddleware({
  type: "function",
})
  .middleware([requireAuthed])
  .inputValidator(
    z.looseObject({
      memoryLaneId: z.string().optional(),
      id: z.string().optional(),
    })
  )
  .server(async ({ next, context, data }) => {
    const memoryLaneId = data.memoryLaneId || data.id;
    if (!memoryLaneId) {
      throw notFound();
    }

    const ml = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, memoryLaneId),
    });

    if (!ml) {
      throw notFound();
    }

    if (ml.userId !== context.user.id) {
      throw new AuthorizationError(
        "Unauthorized",
        "You don't own this memory lane"
      );
    }

    return await next({
      context: {
        ...context,
        user: context.user,
      },
    });
  });
