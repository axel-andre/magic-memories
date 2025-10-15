"server-only";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireAuthed } from "../users/middlewares";
import { assertMemoryLaneOwner } from "./middlewares";
import { db } from "../db";
// import { memory } from "~/db/schema/memory-lane-schema";
import { eq } from "drizzle-orm";
import { memory } from "~/db/memory-lane-schema";
// import z from "zod";
// import { db } from "../db";
// import { memory } from "~/db/memory-lane-schema";
// import { eq } from "drizzle-orm";
// import { requireAuthed } from "../users/middlewares";
// import { assertMemoryLaneOwner } from "./middlewares";

// export const deleteMemoryLaneFn = createServerFn({ method: "POST" })
//   .inputValidator(z.object({ memoryLaneId: z.string() }))
//   .middleware([requireAuthed, assertMemoryLaneOwner])
//   .handler(async ({ data }) => {
//     await db.delete(memory).where(eq(memory.id, data.memoryLaneId));
//   });

export const deleteMemoryFn = createServerFn()
  .inputValidator(z.object({ memoryId: z.string() }))
  .middleware([assertMemoryLaneOwner])
  .handler(async ({ data }) => {
    try {
      await db.delete(memory).where(eq(memory.id, data.memoryId));
    } catch (error) {
      console.error("Error deleting memory", error);
      throw new Error("Failed to delete memory");
    }
  });
