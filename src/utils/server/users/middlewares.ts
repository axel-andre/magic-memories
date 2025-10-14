import { createMiddleware } from "@tanstack/react-start";
import { getUserBySessionFn } from "./read";

export const requireAuthed = createMiddleware({ type: "request" }).server(
  async (ctx) => {
    const user = await getUserBySessionFn();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return ctx.next({
      context: {
        user,
      },
    });
  }
);
