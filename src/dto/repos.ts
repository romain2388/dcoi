import { z } from "zod";

export const upsertRepoSchema = z.object({
  repoId: z.number(),
  fullName: z.string(),
  name: z.string(),
  ownerId: z.number(),
  private: z.boolean(),
  visibility: z.string().optional(),
});

export type UpsertRepoInput = z.infer<typeof upsertRepoSchema>;

export const getRepoOverviewSchema = z.object({
  repoFullName: z.string(),
  limitRuns: z.number().optional(),
});

export type GetRepoOverviewInput = z.infer<typeof getRepoOverviewSchema>;
