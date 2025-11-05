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
    }));
    for (const r of mapped) {
      await context.runMutation(internal.repos.upsertRepo, r);
    }
  },
});

export const syncMarketplaces = internalAction({
  handler: async (context) => {
    const octokit = getAppLevelOctokit();
    const marketplaces = await context.runQuery(
      internal.accounts.getMarketPlacesToUpdate,
    );
    for (const marketplace of marketplaces) {
      const remoteMarketplace = await octokit.request(
        "GET /marketplace_listing/accounts/{account_id}",
        {
          account_id: marketplace.accountId,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );

      const mp = remoteMarketplace.data.marketplace_purchase;
      const plan = mp.plan;
      if (!plan) throw new Error("Could not find a plan");
      await context.runMutation(internal.accounts.upsertMarketplace, {
        accountId: marketplace.accountId,
        planId: plan.id,
        planName: plan.name,
        billingCycle: mp.billing_cycle as "monthly" | "yearly",
        nextBillingDate: mp.next_billing_date ?? "",
      });

      await context.runMutation(internal.accounts.feedCarbon, {
        planId: plan.id,
        billingCycle: mp.billing_cycle as "monthly" | "yearly",
        accountId: marketplace.accountId,
      });
    }
  },
});
