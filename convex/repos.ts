import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const upsertRepo = internalMutation({
  args: {
    repoId: v.number(),
    fullName: v.string(),
    name: v.string(),
    ownerId: v.number(),
    ownerLogin: v.string(),
    ownerType: v.union(v.literal("User"), v.literal("Organization")),
    private: v.boolean(),
    visibility: v.optional(v.string()),
    defaultBranch: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
    archived: v.optional(v.boolean()),
  },
  handler: async (context, payload) => {
    const now = Date.now();
    const existing = await context.db
      .query("repos")
      .withIndex("by_repoId", (q) => q.eq("repoId", payload.repoId))
      .unique();
    await (existing
      ? context.db.patch(existing._id, { ...payload, updatedAt: now })
      : context.db.insert("repos", {
          ...payload,
          createdAt: now,
          updatedAt: now,
        }));
  },
});

export const setReposForInstallation = internalMutation({
  args: {
    installationId: v.number(),
    repos: v.array(
      v.object({
        repoId: v.number(),
        fullName: v.string(),
        name: v.string(),
        private: v.boolean(),
        ownerId: v.number(),
        ownerLogin: v.string(),
        ownerType: v.union(v.literal("User"), v.literal("Organization")),
        visibility: v.optional(v.string()),
        defaultBranch: v.optional(v.string()),
        htmlUrl: v.optional(v.string()),
        archived: v.optional(v.boolean()),
      }),
    ),
  },
  handler: async (context, { installationId, repos }) => {
    const now = Date.now();
    const current = await context.db
      .query("installation_repos")
      .withIndex("by_installationId", (q) =>
        q.eq("installationId", installationId),
      )
      .collect();
    await Promise.all(current.map((r) => context.db.delete(r._id)));
    for (const r of repos) {
      await context.db.insert("installation_repos", {
        installationId,
        repoId: r.repoId,
        fullName: r.fullName,
        name: r.name,
        private: r.private,
        grantedAt: now,
      });
      await context.db.insert("repos", {
        repoId: r.repoId,
        fullName: r.fullName,
        name: r.name,
        ownerId: r.ownerId,
        ownerLogin: r.ownerLogin,
        ownerType: r.ownerType,
        private: r.private,
        visibility: r.visibility,
        defaultBranch: r.defaultBranch,
        htmlUrl: r.htmlUrl,
        archived: r.archived,
        createdAt: now,
        updatedAt: now,
      });
    }
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
