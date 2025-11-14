import { z } from "zod";

export const upsertWorkflowRunSchema = z.object({
  accountId: z.number(),
  repoId: z.number(),
  repoFullName: z.string(),
  runId: z.number(),
  name: z.string(),
  conclusion: z.string().optional(),
  headbranch: z.string(),
  createdAt: z.string(),
});

export type UpsertWorkflowRunInput = z.infer<typeof upsertWorkflowRunSchema>;

export const upsertWorkflowJobSchema = z.object({
  jobId: z.number(),
  name: z.string(),
  conclusion: z.string(),
  runId: z.number(),
  durationMs: z.number(),
  completedAt: z.string(),
  repoId: z.number(),
});

export type UpsertWorkflowJobInput = z.infer<typeof upsertWorkflowJobSchema>;

export const listRunsByRepoSchema = z.object({
  repoFullName: z.string(),
  limit: z.number().optional(),
});

export type ListRunsByRepoInput = z.infer<typeof listRunsByRepoSchema>;

export const listJobsByRunSchema = z.object({
  runId: z.number(),
  limit: z.number().optional(),
});

export type ListJobsByRunInput = z.infer<typeof listJobsByRunSchema>;

export const getRepoRunsWithPaginationSchema = z.object({
  repoFullName: z.string(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type GetRepoRunsWithPaginationInput = z.infer<
  typeof getRepoRunsWithPaginationSchema
>;
