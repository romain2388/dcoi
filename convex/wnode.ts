"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import {
  getAppLevelOctokit,
  getInstallationOctokit,
  paginateAll,
} from "./utilities.github";
import { internal } from "./_generated/api";

export const refreshAccountDetails = internalAction({
  args: {
    githubAccountId: v.number(),
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
  },
  handler: async (context, arguments_) => {
    const octokit = getAppLevelOctokit();
    if (arguments_.accountType === "Organization") {
      6;
      const { data } = await octokit.rest.orgs.get({
        org: arguments_.accountLogin,
      });
      await context.runMutation(internal.accounts.patchAccountDetails, {
        githubAccountId: arguments_.githubAccountId,
        accountLogin: arguments_.accountLogin,
        accountType: arguments_.accountType,
        accountName: (data as any).name ?? undefined,
        avatarUrl: (data as any).avatar_url ?? undefined,
        htmlUrl: (data as any).html_url ?? undefined,
      });
    } else {
      const { data } = await octokit.rest.users.getByUsername({
        username: arguments_.accountLogin,
      });
      await context.runMutation(internal.accounts.patchAccountDetails, {
        githubAccountId: arguments_.githubAccountId,
        accountLogin: arguments_.accountLogin,
        accountType: arguments_.accountType,
        accountName: (data as any).name ?? undefined,
        avatarUrl: (data as any).avatar_url ?? undefined,
        htmlUrl: (data as any).html_url ?? undefined,
      });
    }
  },
});

export const syncInstallationRepos = internalAction({
  args: { installationId: v.number(), accountId: v.number() },
  handler: async (context, { installationId, accountId }) => {
    const octokit = await getInstallationOctokit(installationId);
    const repos = await paginateAll<any>(
      octokit,
      octokit.rest.apps.listReposAccessibleToInstallation,
      {},
    );
    const mapped = repos.map((r) => ({
      repoId: r.id,
      fullName: r.full_name,
      name: r.name,
      private: !!r.private,
      ownerId: r.owner.id,
      ownerLogin: r.owner.login,
      ownerType: r.owner.type,
      visibility: r.visibility,
      defaultBranch: r.default_branch,
      htmlUrl: r.html_url,
      archived: !!r.archived,
    }));
    await context.runMutation(internal.repos.setReposForInstallation, {
      installationId,
      repos: mapped,
    });
    // Upsert des métadonnées canoniques de chaque repo
    for (const r of mapped) {
      await context.runMutation(internal.repos.upsertRepo, r);
    }
  },
});
