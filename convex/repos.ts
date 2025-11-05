import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const upsertRepo = internalMutation({
  args: {
    repoId: v.number(),
    fullName: v.string(),
    name: v.string(),
    ownerId: v.number(),
    private: v.boolean(),
    visibility: v.optional(v.string()),
  },
  handler: async (context, payload) => {
    const existing = await context.db
      .query("repos")
      .withIndex("by_repoId", (q) => q.eq("repoId", payload.repoId))
      .unique();
    await (existing
      ? context.db.patch(existing._id, { ...payload })
      : context.db.insert("repos", {
          ...payload,
        }));
  },
});

export const getRepoOverview = query({
  args: { repoFullName: v.string(), limitRuns: v.optional(v.number()) },
  handler: async (context, { repoFullName, limitRuns }) => {
    const repo = await context.db
      .query("repos")
      .withIndex("by_fullName", (q) => q.eq("fullName", repoFullName))
      .unique();
    if (!repo) return;
    const account = await context.db
      .query("accounts")
      .withIndex("by_githubAccountId", (q) =>
        q.eq("githubAccountId", repo.ownerId),
      )
      .unique();
    const wallet = await context.db
      .query("wallets")
      .withIndex("by_accountId", (q) => q.eq("accountId", repo.ownerId))
      .unique();
    const runs = await context.db
      .query("workflow_runs")
      .withIndex("by_repoId_createdAt", (q) => q.eq("repoId", repo.repoId))
      .order("desc")
      .collect();
    const recentRuns = limitRuns ? runs.slice(0, limitRuns) : runs;
    return { repo, owner: account, wallet, recentRuns };
  },
});
