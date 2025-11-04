import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { verifyWebhookSignature } from "./utilities.github";

export const upsertInstallation = internalMutation({
  args: {
    installationId: v.number(),
    accountId: v.number(),
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
    repository_selection: v.union(v.literal("all"), v.literal("selected")),
    suspended: v.boolean(),
  },
  handler: async (context, arguments_) => {
    const now = Date.now();
    const existing = await context.db
      .query("installations")
      .withIndex("by_installationId", (q) =>
        q.eq("installationId", arguments_.installationId),
      )
      .unique();
    if (existing) {
      await context.db.patch(existing._id, { ...arguments_, updatedAt: now });
      return existing;
    }
    const _id = await context.db.insert("installations", {
      ...arguments_,
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
    });
    return true; // fresh
  },
});
