import { auth } from "~/utils/server/auth";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/files/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { _splat } = params;
        if (!_splat) {
          return new Response("File not found", { status: 404 });
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
