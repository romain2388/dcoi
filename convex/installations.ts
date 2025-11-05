import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const upsertInstallation = internalMutation({
  args: {
    installationId: v.number(),
    accountId: v.number(),
  },
  handler: async (context, arguments_) => {
    const existing = await context.db
      .query("installations")
      .withIndex("by_installationId", (q) =>
        q.eq("installationId", arguments_.installationId),
      )
      .unique();
    if (existing) {
      await context.db.patch(existing._id, { ...arguments_ });
      return existing;
    }
    const _id = await context.db.insert("installations", {
      ...arguments_,
    });
    return await context.db.get(_id);
  },
});

export const recordWebhookDelivery = internalMutation({
  args: {
    deliveryId: v.string(),
    event: v.string(),
    action: v.optional(v.string()),
  },
  handler: async (context, { deliveryId, event, action }) => {
    const existing = await context.db
      .query("webhookDeliveries")
      .withIndex("by_deliveryId", (q) => q.eq("deliveryId", deliveryId))
      .unique();
    if (existing) {
      return false; // duplicate
    }
    const now = Date.now();
    await context.db.insert("webhookDeliveries", {
      deliveryId,
      event,
      action: action || undefined,
    });
    return true; // fresh
  },
});
