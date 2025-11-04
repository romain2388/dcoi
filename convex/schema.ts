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
    createdAt: v.number(), // epoch ms (Date.now())
  }).index("by_deliveryId", ["deliveryId"]),
  accounts: defineTable({
    githubAccountId: v.number(), // marketplace_purchase.account.id
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
    accountName: v.optional(v.string()), // display name si dispo
    avatarUrl: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_githubAccountId", ["githubAccountId"]),
  installations: defineTable({
    installationId: v.number(),
    accountId: v.number(), // FK logique → accounts.githubAccountId
    accountLogin: v.string(),
    accountType: v.union(v.literal("User"), v.literal("Organization")),
    repository_selection: v.union(v.literal("all"), v.literal("selected")),
    suspended: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_installationId", ["installationId"])
    .index("by_accountId", ["accountId"]),
  installation_repos: defineTable({
    installationId: v.number(),
    repoId: v.number(),
    fullName: v.string(), // owner/name
    name: v.string(),
    private: v.boolean(),
    grantedAt: v.number(),
  })
    .index("by_installationId", ["installationId"])
    .index("by_repoId", ["repoId"]),
  repos: defineTable({
    repoId: v.number(),
    fullName: v.string(),
    name: v.string(),
    ownerId: v.number(), // accounts.githubAccountId
    ownerLogin: v.string(),
    ownerType: v.union(v.literal("User"), v.literal("Organization")),
    private: v.boolean(),
    visibility: v.optional(v.string()),
    defaultBranch: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
    archived: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_repoId", ["repoId"])
    .index("by_fullName", ["fullName"])
    .index("by_ownerId", ["ownerId"]),
  marketplace_subscriptions: defineTable({
    accountId: v.number(),
    planId: v.number(),
    planName: v.string(),
    priceModel: v.string(), // FREE | FLAT_RATE | PER_UNIT
    unitName: v.optional(v.string()),
    unitCount: v.optional(v.number()),
    billingCycle: v.optional(
      v.union(v.literal("monthly"), v.literal("yearly")),
    ),
    onFreeTrial: v.optional(v.boolean()),
    freeTrialEndsOn: v.optional(v.string()),
    nextBillingDate: v.optional(v.string()),
    effectiveDate: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_accountId", ["accountId"]),
  wallets: defineTable({
    accountId: v.number(),
    balanceCredits: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("cancelled"),
      v.literal("suspended"),
    ),
    entitlements: v.any(), // projection du plan Marketplace → quotas
    lastReconciledAt: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_accountId", ["accountId"]),
  webhook_deliveries: defineTable({
    deliveryId: v.string(), // X-GitHub-Delivery (GUID)
    event: v.string(),
    action: v.optional(v.string()),
    processedAt: v.number(),
  }).index("by_deliveryId", ["deliveryId"]),
  // Runs (workflow_run)
  workflow_runs: defineTable({
    accountId: v.number(),
    installationId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    runId: v.number(), // GitHub run id
    runAttempt: v.optional(v.number()),
    name: v.optional(v.string()),
    headSha: v.optional(v.string()),
    headBranch: v.optional(v.string()),
    status: v.optional(v.string()),
    conclusion: v.optional(v.string()),
    event: v.optional(v.string()),
    htmlUrl: v.optional(v.string()),
    createdAt: v.number(), // epoch ms from created_at
    runStartedAt: v.optional(v.number()),
    updatedAt: v.number(),
    durationMs: v.optional(v.number()),
  })
    .index("by_runId", ["runId"])
    .index("by_install_repo", ["installationId", "repoId"])
    .index("by_account_createdAt", ["accountId", "createdAt"])
    .index("by_repoId_createdAt", ["repoId", "createdAt"]),
  // Jobs (workflow_job) avec steps
  workflow_jobs: defineTable({
    jobId: v.number(),
    runId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    name: v.string(),
    status: v.optional(v.string()),
    conclusion: v.optional(v.string()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    runnerName: v.optional(v.string()),
    runnerGroupId: v.optional(v.number()),
    runnerId: v.optional(v.number()),
    labels: v.optional(v.array(v.string())),
    attempt: v.optional(v.number()),
    htmlUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_jobId", ["jobId"])
    .index("by_runId_startedAt", ["runId", "startedAt"])
    .index("by_repoId_startedAt", ["repoId", "startedAt"]),
});
