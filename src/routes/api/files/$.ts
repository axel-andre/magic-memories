import { auth } from "~/utils/server/auth";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { db } from "~/utils/server/db";
import { memoryLane } from "~/db/memory-lane-schema";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/files/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { _splat } = params;
        if (!_splat) {
          return new Response("File not found", { status: 404 });
        }

        const filePathParts = _splat.split("/");
        if (filePathParts.length < 2) {
          return new Response("Invalid file path", { status: 400 });
        }

        const memoryLaneId = filePathParts[0];

        const ml = await db.query.memoryLane.findFirst({
          where: eq(memoryLane.id, memoryLaneId),
        });

        if (!ml) {
          return new Response("File not found", { status: 404 });
        }

        const headers = request.headers;
        const session = await auth.api.getSession({ headers });

        if (ml.status === "published") {
        } else if (session?.user?.id && session.user.id === ml.userId) {
        } else {
          return new Response("Forbidden", { status: 403 });
        }

        const file = await env.IMAGE_BUCKET.get(_splat);
        if (!file) {
          return new Response("File not found", { status: 404 });
        }

        const response = new Response(file.body);
        response.headers.set(
          "Content-Type",
          file.httpMetadata?.contentType || "application/octet-stream"
        );
        return response;
      },
    },
  },
});
