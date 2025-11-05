import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    carbonStandard: v.string(),
    carbonQuantity: v.int64(),
    carbonPrice: v.number(),
    country: v.string(),
    image1Url: v.string(),
    image2Url: v.string(),
    image3Url: v.string(),
    videoUrl: v.string(),
    proofOfRetirementUrl: v.string(),
  }),
  webhookDeliveries: defineTable({
    deliveryId: v.string(), // X-GitHub-Delivery (GUID)
    event: v.string(),
    action: v.optional(v.string()),
  }).index("by_deliveryId", ["deliveryId"]),
  accounts: defineTable({
    githubAccountId: v.number(), // marketplace_purchase.account.id
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
    accountName: v.optional(v.string()), // display name si dispo
    avatarUrl: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
  }).index("by_githubAccountId", ["githubAccountId"]),
  installations: defineTable({
    installationId: v.number(),
    accountId: v.number(),
  })
    .index("by_installationId", ["installationId"])
    .index("by_accountId", ["accountId"]),
  installation_repos: defineTable({
    installationId: v.number(),
    repoId: v.number(),
  })
    .index("by_installationId", ["installationId"])
    .index("by_repoId", ["repoId"]),
  repos: defineTable({
    repoId: v.number(),
    fullName: v.string(),
    name: v.string(),
    ownerId: v.number(), // accounts.githubAccountId
    private: v.boolean(),
  })
    .index("by_repoId", ["repoId"])
    .index("by_fullName", ["fullName"])
    .index("by_ownerId", ["ownerId"]),
  marketplace_subscriptions: defineTable({
    accountId: v.number(),
    planId: v.number(),
    planName: v.string(),
    billingCycle: v.optional(
      v.union(v.literal("monthly"), v.literal("yearly")),
    ),
    nextBillingDate: v.optional(v.string()),
    effectiveDate: v.optional(v.string()),
  }).index("by_accountId", ["accountId"]),
  wallets: defineTable({
    accountId: v.number(),
    balanceCredits: v.number(),
    active: v.boolean(),
  }).index("by_accountId", ["accountId"]),
  community_wallet: defineTable({
    balanceCredits: v.number(),
  }),
  // Webhook deliveries log
  webhook_deliveries: defineTable({
    deliveryId: v.string(), // X-GitHub-Delivery (GUID)
    event: v.string(),
    action: v.optional(v.string()),
  }).index("by_deliveryId", ["deliveryId"]),
  // Runs (workflow_run)
  workflow_runs: defineTable({
    accountId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    runId: v.number(), // GitHub run id
    name: v.optional(v.string()),
    headBranch: v.optional(v.string()),
    conclusion: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_runId", ["runId"])
    .index("by_account_createdAt", ["accountId", "createdAt"])
    .index("by_repoId_createdAt", ["repoId", "createdAt"]),
  // Jobs (workflow_job) avec steps
  workflow_jobs: defineTable({
    jobId: v.number(),
    repoId: v.number(),
    runId: v.number(),
    name: v.string(),
    conclusion: v.optional(v.string()),
    durationMs: v.optional(v.number()),
    completedAt: v.optional(v.string()),
  })
    .index("by_jobId", ["jobId"])
    .index("by_runId_startedAt", ["runId", "completedAt"]),
});
