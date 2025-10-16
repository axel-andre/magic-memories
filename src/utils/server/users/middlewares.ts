"server-only";
import { createMiddleware } from "@tanstack/react-start";
import { getUserBySessionFn } from "./read";
import { AuthorizationError } from "~/utils/errors";

export const requireAuthed = createMiddleware({ type: "function" }).server(
  async (ctx) => {
    const user = await getUserBySessionFn();
    if (!user) {
      throw new AuthorizationError(
        "Unauthorized",
        "You must be logged in to access this resource"
      );
    }
    return ctx.next({
      context: {
        user,
      },
    });
  }
);
