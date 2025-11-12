import { createFileRoute } from "@tanstack/react-router";
import { handleWebhooks } from "../../../functions/webhook";

export const Route = createFileRoute("/api/github/")({
  server: {
    handlers: {
      POST: async (request) => {
        await handleWebhooks(request);
        return new Response("handled", { status: 200 });
      },
    },
  },
});
