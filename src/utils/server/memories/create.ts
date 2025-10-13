"server-only";
import { db } from "../db";
import { memoryLane } from "~/db/memory-lane-schema";
import { auth } from "../auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { createMemorySchema } from "./schemas";

export const createMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(createMemorySchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const newMemory = await db
      .insert(memoryLane)
      .values({
        name: data.name,
        status: "draft",
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    const ml = await db.query.memoryLane.findFirst({
      where: eq(memoryLane.id, newMemory[0].id),
      with: {
        user: true,
      },
    });
    console.log({ ml });

    return newMemory[0];
  });

