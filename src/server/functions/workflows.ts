import { createServerOnlyFn } from "@tanstack/react-start";
import {
  listJobsByRunSchema,
  listRunsByRepoSchema,
  upsertWorkflowJobSchema,
  upsertWorkflowRunSchema,
} from "@controller/dto/worklows";
import { workflowRunModel } from "../db/schemas/worflow-run-schema";
import { repoModel } from "../db/schemas/repo-schema";
import { workflowJobModel } from "../db/schemas/worflow-job-schema";
import { offsetRunwCommunityWallet, offsetRunwUserWallet } from "./accounts";

export const upsertWorkflowRun = createServerOnlyFn(
  async (arguments_: {
    accountId: number;
    repoId: number;
    repoFullName: string;
    runId: number;
    name: string;
    conclusion?: string;
    headbranch: string;
    createdAt: string;
  }) => {
    const validated = upsertWorkflowRunSchema.parse(arguments_);

    const existing = await workflowRunModel.findOne({
      runId: validated.runId,
    });

    if (existing) return;

    const jobs = await workflowJobModel.find({
      runId: validated.runId,
    });

    const totalDurationMs = jobs.reduce(
      (accumulator, job) => accumulator + (Number(job.durationMs) || 0),
      0,
    );
    const totalCarbon = Math.round(totalDurationMs * 0.000_008_887);

    const repo = await repoModel.findOne({
      repoId: validated.repoId,
    });

    if (!repo) {
      throw new Error(`Repo with ID ${validated.repoId} not found.`);
    }

    const offsetOK = repo.private
      ? await offsetRunwUserWallet({
          repoOwnerId: repo.ownerId,
          creditsDelta: totalCarbon,
        })
      : await offsetRunwCommunityWallet({
          creditsDelta: totalCarbon,
        });

    await workflowRunModel.create({
      accountId: validated.accountId,
      repoId: validated.repoId,
      repoFullName: validated.repoFullName,
      runId: validated.runId,
      name: validated.name,
      headBranch: validated.headbranch,
      conclusion: validated.conclusion,
      createdAt: validated.createdAt,
      totalCarbon,
      isOffsetOK: offsetOK,
    });
  },
);

export const upsertWorkflowJob = createServerOnlyFn(
  async (arguments_: {
    jobId: number;
    name: string;
    conclusion: string;
    runId: number;
    durationMs: number;
    completedAt: string;
    repoId: number;
  }) => {
    const validated = upsertWorkflowJobSchema.parse(arguments_);

    const existing = await workflowJobModel.findOne({
      jobId: validated.jobId,
    });

    await (existing
      ? workflowJobModel.findByIdAndUpdate(existing._id, validated, {
          new: true,
        })
      : workflowJobModel.create(validated));
  },
);

export const listRunsByRepo = createServerOnlyFn(
  async (arguments_: { repoFullName: string; limit?: number }) => {
    const validated = listRunsByRepoSchema.parse(arguments_);

    const repo = await repoModel.findOne({
      fullName: validated.repoFullName,
    });

    if (!repo) {
      return { repo: undefined, runs: [] };
    }

    const runs = await workflowRunModel.find({ repoId: repo.repoId });

    return {
      repo,
      runs: validated.limit ? runs.slice(0, validated.limit) : runs,
    };
  },
);

export const listJobsByRun = createServerOnlyFn(
  async (arguments_: { runId: number; limit?: number }) => {
    const validated = listJobsByRunSchema.parse(arguments_);

    const jobs = await workflowJobModel.find({ runId: validated.runId });

    return validated.limit ? jobs.slice(0, validated.limit) : jobs;
  },
);
