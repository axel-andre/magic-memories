"server-only";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { auth } from "../auth";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getUserByIdFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    return session.user;
  });
export const getUserBySessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequestHeaders() });
    return session?.user ?? null;
  }
);
