import { z } from "zod";

export const upsertAccountSchema = z.object({
  githubAccountId: z.number(),
  accountLogin: z.string(),
  accountType: z.enum(["User", "Organization"]),
  accountName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  htmlUrl: z.string().url().optional(),
});

export type UpsertAccountType = z.infer<typeof upsertAccountSchema>;

export const marketplacePayloadSchema = z.object({
  accountId: z.number(),
  planId: z.number(),
  planName: z.string(),
  billingCycle: z.enum(["monthly", "yearly"]).optional(),
  nextBillingDate: z.string().optional(),
  effectiveDate: z.string().optional(),
});

export type MarketplacePayloadType = z.infer<typeof marketplacePayloadSchema>;

export const offsetWalletSchema = z.object({
  creditsDelta: z.number(),
});

export const offsetUserWalletSchema = z.object({
  repoOwnerId: z.number(),
  creditsDelta: z.number(),
});

export const feedCarbonSchema = z.object({
  planId: z.number(),
  billingCycle: z.enum(["monthly", "yearly"]),
  accountId: z.number(),
});
