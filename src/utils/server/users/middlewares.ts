"server-only";
import { createMiddleware } from "@tanstack/react-start";
import { getUserBySessionFn } from "./read";
import { AuthorizationError } from "~/utils/errors";

/**
 * This middleware checks if the user is authenticated.
 * @throws {AuthorizationError} if the user is not authenticated.
 */
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
/**
 * This middleware checks if the user is authenticated or public.
 */
export const checkAuthOrPublic = createMiddleware({ type: "function" }).server(
  async (ctx) => {
    const user = await getUserBySessionFn();
    return ctx.next({
      context: {
        user: user ?? null,
      },
    });
  }
);