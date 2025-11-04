import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const upsertAccount = internalMutation({
  args: {
    githubAccountId: v.number(),
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
  },
  handler: async (context, arguments_) => {
    const now = Date.now();
    const existing = await context.db
      .query("accounts")
      .withIndex("by_githubAccountId", (q) =>
        q.eq("githubAccountId", arguments_.githubAccountId),
      )
      .unique();
    if (existing) {
      await context.db.patch(existing._id, {
        accountLogin: arguments_.accountLogin,
        accountType: arguments_.accountType,
        updatedAt: now,
      });
      return existing;
    }
    const _id = await context.db.insert("accounts", {
      ...arguments_,
      createdAt: now,
      updatedAt: now,
    });
    return await context.db.get(_id);
  },
});
export const patchAccountDetails = internalMutation({
  args: {
    githubAccountId: v.number(),
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
    accountName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
  },
  handler: async (context, arguments_) => {
    const existing = await context.db
      .query("accounts")
      .withIndex("by_githubAccountId", (q) =>
        q.eq("githubAccountId", arguments_.githubAccountId),
      )
      .unique();
    if (existing) {
      await context.db.patch(existing._id, {
        ...arguments_,
        updatedAt: Date.now(),
      });
    }
  },
});
export const upsertMarketplace = internalMutation({
  args: {
    accountId: v.number(),
    planId: v.number(),
    planName: v.string(),
    priceModel: v.string(),
    unitName: v.optional(v.string()),
    unitCount: v.optional(v.number()),
    billingCycle: v.optional(
      v.union(v.literal("monthly"), v.literal("yearly")),
    ),
    onFreeTrial: v.optional(v.boolean()),
    freeTrialEndsOn: v.optional(v.string()),
    nextBillingDate: v.optional(v.string()),
    effectiveDate: v.optional(v.string()),
  },
  handler: async (context, payload) => {
    const now = Date.now();
    const current = await context.db
      .query("marketplace_subscriptions")
      .withIndex("by_accountId", (q) => q.eq("accountId", payload.accountId))
      .unique();
    if (current) {
      await context.db.patch(current._id, { ...payload, updatedAt: now });
    } else {
      9;
      await context.db.insert("marketplace_subscriptions", {
        ...payload,
        updatedAt: now,
      });
    }
    const w = await context.db
      .query("wallets")
      .withIndex("by_accountId", (q) => q.eq("accountId", payload.accountId))
      .unique();
    const entitlements = {
      planId: payload.planId,
      planName: payload.planName,
      unitCount: payload.unitCount ?? undefined,
    };
    await (w
      ? context.db.patch(w._id, {
          status: payload.onFreeTrial ? "trial" : "active",
          entitlements,
          updatedAt: now,
        })
      : context.db.insert("wallets", {
          accountId: payload.accountId,
          balanceCredits: 0,
          status: payload.onFreeTrial ? "trial" : "active",
          entitlements,
          updatedAt: now,
        }));
  },
});
