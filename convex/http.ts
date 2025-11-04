import { httpRouter } from "convex/server";
import { action, httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/events/github/app",
  method: "POST",
  handler: httpAction(async (context, request) => {
    await context.runAction(internal.webhook.handleWebhooks, {
      request: { request },
    });

    return new Response("OK", { status: 200 });
  }),
});

export default http;
