"server-only";
import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { requireAuthed } from "../users/middlewares";

export const assertMemoryLaneOwner = createMiddleware({
  type: "function",
})
  .middleware([requireAuthed])
  .inputValidator(
    z.looseObject({
      memoryLaneId: z.string(),
    })
  )
  .server(async ({ next, context }) => {
    return await next({
      context: {
        ...context,
        user: context.user,
      },
    });
  });
