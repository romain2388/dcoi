import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  query,
} from "./_generated/server";
import { getInstallationOctokit, paginateAll } from "./utilities.github";
import { internal } from "./_generated/api";
// Upsert d’un run (workflow_run)
export const upsertWorkflowRun = internalMutation({
  args: {
    accountId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    runId: v.number(),
    name: v.string(),
    conclusion: v.optional(v.string()),
    headbranch: v.string(),
    createdAt: v.string(),
  },
  handler: async (
    context,
    {
      accountId,
      repoId,
      repoFullName,
      runId,
      name,
      conclusion,
      headbranch,
      createdAt,
    },
  ) => {
    const existing = await context.db
      .query("workflow_runs")
      .withIndex("by_runId", (q) => q.eq("runId", runId))
      .unique();

    if (existing) return;

    const jobs = await context.db
      .query("workflow_jobs")
      .withIndex("by_runId_startedAt", (q) => q.eq("runId", runId))
      .collect();
    const totalDurationMs = jobs.reduce(
      (accumulator, job) => accumulator + (Number(job.durationMs) || 0),
      0,
    );
    const totalCarbon = Math.round(totalDurationMs * 0.000_008_887); // en grammes

    const repo = await context.db
      .query("repos")
      .withIndex("by_repoId", (q) => q.eq("repoId", repoId))
      .unique();

    if (!repo) {
      throw new Error(`Repo with ID ${repoId} not found.`);
    }

    const offsetOK = repo.private
      ? await context.runMutation(internal.accounts.offsetRunwUserWallet, {
          repoOwnerId: repo.ownerId,
          creditsDelta: totalCarbon,
        })
      : await context.runMutation(internal.accounts.offsetRunwCommunityWallet, {
          creditsDelta: totalCarbon,
        });

    const document_ = {
      accountId: accountId,
      repoId: repoId,
      repoFullName: repoFullName,
      runId: runId,
      name: name,
      headBranch: headbranch,
      conclusion: conclusion,
      createdAt: createdAt,
      totalCarbon: totalCarbon,
      isOffsetOK: offsetOK,
    };
    await context.db.insert("workflow_runs", document_);
  },
});
// Upsert d’un job (workflow_job) avec steps
export const upsertWorkflowJob = internalMutation({
  args: {
    jobId: v.number(),
    name: v.string(),
    conclusion: v.string(),
    runId: v.number(),
    durationMs: v.number(),
    completedAt: v.string(),
    repoId: v.number(),
  },
  handler: async (
    context,
    { jobId, name, conclusion, runId, durationMs, completedAt, repoId },
  ) => {
    const existing = await context.db
      .query("workflow_jobs")
      .withIndex("by_jobId", (q) => q.eq("jobId", jobId))
      .unique();
    const document_ = {
      jobId: jobId,
      runId: runId,
      name: name,
      conclusion: conclusion,
      durationMs: durationMs,
      completedAt: completedAt,
      repoId: repoId,
    };
    await (existing
      ? context.db.patch(existing._id, document_)
      : context.db.insert("workflow_jobs", document_));
  },
});

// ======= QUERIES pour pages par dépôt =======
export const listRunsByRepo = query({
  args: { repoFullName: v.string(), limit: v.optional(v.number()) },
  handler: async (context, { repoFullName, limit }) => {
    // retrouver l’id du repo
    const repo = await context.db
      .query("repos")
      .withIndex("by_fullName", (q) => q.eq("fullName", repoFullName))
      .unique();
    if (!repo) return { repo: undefined, runs: [] };
    const q = context.db
      .query("workflow_runs")
      .withIndex("by_repoId_createdAt", (q) => q.eq("repoId", repo.repoId))
      .order("desc");
    const runs = await q.collect();
    return { repo, runs: limit ? runs.slice(0, limit) : runs };
  },
});
export const listJobsByRun = query({
  args: { runId: v.number(), limit: v.optional(v.number()) },
  handler: async (context, { runId, limit }) => {
    const q = context.db
      .query("workflow_jobs")
      .withIndex("by_runId_startedAt", (q) => q.eq("runId", runId))
      .order("desc");
    const jobs = await q.collect();
    return limit ? jobs.slice(0, limit) : jobs;
  },
});
