import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const upsertAccount = internalMutation({
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
      return existing;
    }
    const _id = await context.db.insert("accounts", {
      ...arguments_,
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
      });
    }
  },
});

export const upsertMarketplace = internalMutation({
  args: {
    accountId: v.number(),
    planId: v.number(),
    planName: v.string(),
    billingCycle: v.optional(
      v.union(v.literal("monthly"), v.literal("yearly")),
    ),
    nextBillingDate: v.optional(v.string()),
    effectiveDate: v.optional(v.string()),
  },
  handler: async (context, payload) => {
    const now = Date.now();
    const current = await context.db
      .query("marketplace_subscriptions")
      .withIndex("by_accountId", (q) => q.eq("accountId", payload.accountId))
      .unique();
    await (current
      ? context.db.patch(current._id, { ...payload })
      : context.db.insert("marketplace_subscriptions", {
          ...payload,
        }));
  },
});

export const offsetRunwCommunityWallet = internalMutation({
  args: {
    creditsDelta: v.number(),
  },
  handler: async (context, { creditsDelta }) => {
    const walletRecords = await context.db.query("community_wallet").collect();
    let wallet;
    if (walletRecords.length === 0) {
      const _id = await context.db.insert("community_wallet", {
        balanceCredits: 0,
      });
      wallet = await context.db.get(_id);
    } else {
      wallet = walletRecords[0];
    }
    const balance = wallet.balanceCredits - creditsDelta;
    if (balance < 0) {
      return false;
    }
    await context.db.patch(wallet._id, {
      balanceCredits: balance,
    });
    return true;
  },
});

export const offsetRunwUserWallet = internalMutation({
  args: {
    repoOwnerId: v.number(),
    creditsDelta: v.number(),
  },
  handler: async (context, { repoOwnerId, creditsDelta }) => {
    const wallet = await context.db
      .query("wallets")
      .withIndex("by_accountId", (q) => q.eq("accountId", repoOwnerId))
      .unique();
    if (!wallet) {
      return false;
    }
    const balance = wallet.balanceCredits - creditsDelta;
    if (balance < 0) {
      return false;
    }
    await context.db.patch(wallet._id, {
      balanceCredits: balance,
    });
    return true;
  },
});

export const getMarketPlacesToUpdate = internalQuery({
  handler: async (context) => {
    const now = Date.now();

    return await context.db
      .query("marketplace_subscriptions")
      .filter((m) => m.lt(m.field("nextBillingDate"), now))
      .collect();
  },
});

export const feedCarbon = internalMutation({
  args: {
    planId: v.number(),
    billingCycle: v.union(v.literal("monthly"), v.literal("yearly")),
    accountId: v.number(),
  },
  handler: async (context, { planId, billingCycle, accountId }) => {
    let creditsToAddCommunity = 0;
    let creditsToAddUser = 0;
    switch (planId) {
      case 2: {
        billingCycle === "monthly"
          ? (creditsToAddCommunity = 100)
          : (creditsToAddCommunity = 1200);
        break;
      }
      case 3: {
        billingCycle === "monthly"
          ? (creditsToAddCommunity = 200)
          : (creditsToAddCommunity = 2400);
        break;
      }
      case 4: {
        billingCycle === "monthly"
          ? (creditsToAddCommunity = 500)
          : (creditsToAddCommunity = 6000);
        break;
      }
      case 5: {
        billingCycle === "monthly"
          ? ((creditsToAddUser = 80), (creditsToAddCommunity = 20))
          : ((creditsToAddUser = 1000), (creditsToAddCommunity = 200));
        break;
      }
      case 6: {
        billingCycle === "monthly"
          ? ((creditsToAddUser = 160), (creditsToAddCommunity = 40))
          : ((creditsToAddUser = 2000), (creditsToAddCommunity = 500));
        break;
      }
      case 7: {
        billingCycle === "monthly"
          ? ((creditsToAddUser = 400), (creditsToAddCommunity = 100))
          : ((creditsToAddUser = 5000), (creditsToAddCommunity = 1500));
        break;
      }
    }

    if (creditsToAddCommunity > 0) {
      const walletRecords = await context.db
        .query("community_wallet")
        .collect();
      let wallet;
      if (walletRecords.length === 0) {
        const _id = await context.db.insert("community_wallet", {
          balanceCredits: creditsToAddCommunity,
        });
        wallet = await context.db.get(_id);
      } else {
        wallet = walletRecords[0];
        await context.db.patch(wallet._id, {
          balanceCredits: wallet.balanceCredits + creditsToAddCommunity,
        });
      }
    }

    if (creditsToAddUser > 0) {
      const wallet = await context.db
        .query("wallets")
        .withIndex("by_accountId", (q) => q.eq("accountId", accountId))
        .unique();
      if (wallet) {
        await context.db.patch(wallet._id, {
          balanceCredits: wallet.balanceCredits + creditsToAddUser,
        });
      }
    }
  },
});
