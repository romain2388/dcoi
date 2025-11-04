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
    installationId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    run: v.object({
      id: v.number(),
      name: v.optional(v.string()),
      head_sha: v.optional(v.string()),
      head_branch: v.optional(v.string()),
      status: v.optional(v.string()),
      conclusion: v.optional(v.string()),
      event: v.optional(v.string()),
      html_url: v.optional(v.string()),
      created_at: v.string(),
      updated_at: v.string(),
      run_started_at: v.optional(v.string()),
      run_attempt: v.optional(v.number()),
    }),
  },
  handler: async (
    context,
    { accountId, installationId, repoId, repoFullName, run },
  ) => {
    const existing = await context.db
      .query("workflow_runs")
      .withIndex("by_runId", (q) => q.eq("runId", run.id))
      .unique();
    const createdAtMs = Date.parse(run.created_at);
    const updatedAtMs = Date.parse(run.updated_at);
    const startedMs = run.run_started_at
      ? Date.parse(run.run_started_at)
      : undefined;
    const durationMs = startedMs
      ? Math.max(0, updatedAtMs - startedMs)
      : undefined;
    const document_ = {
      accountId,
      installationId,
      repoId,
      repoFullName,
      runId: run.id,
      runAttempt: run.run_attempt,
      name: run.name,
      headSha: run.head_sha,
      headBranch: run.head_branch,
      status: run.status,
      conclusion: run.conclusion,
      event: run.event,
      htmlUrl: run.html_url,
      createdAt: createdAtMs,
      updatedAt: updatedAtMs,
      runStartedAt: startedMs,
      durationMs,
    };
    await (existing
      ? context.db.patch(existing._id, document_)
      : context.db.insert("workflow_runs", document_));
  },
});
// Upsert d’un job (workflow_job) avec steps
export const upsertWorkflowJob = internalMutation({
  args: {
    accountId: v.number(),
    installationId: v.number(),
    repoId: v.number(),
    repoFullName: v.string(),
    runId: v.number(),
    job: v.object({
      id: v.number(),
      name: v.string(),
      status: v.optional(v.string()),
      conclusion: v.optional(v.string()),
      started_at: v.optional(v.string()),
      completed_at: v.optional(v.string()),
      runner_name: v.optional(v.string()),
      runner_group_id: v.optional(v.number()),
      runner_id: v.optional(v.number()),
      labels: v.optional(v.array(v.string())),
      run_attempt: v.optional(v.number()),
      html_url: v.optional(v.string()),
      steps: v.optional(
        v.array(
          v.object({
            name: v.string(),
            status: v.optional(v.string()),
            conclusion: v.optional(v.string()),
            number: v.optional(v.number()),
            started_at: v.optional(v.string()),
            completed_at: v.optional(v.string()),
          }),
        ),
      ),
    }),
  },
  handler: async (
    context,
    { accountId, installationId, repoId, repoFullName, runId, job },
  ) => {
    const now = Date.now();
    const startedMs = job.started_at ? Date.parse(job.started_at) : undefined;
    const completedMs = job.completed_at
      ? Date.parse(job.completed_at)
      : undefined;
    const durationMs =
      startedMs && completedMs
        ? Math.max(0, completedMs - startedMs)
        : undefined;
    const existing = await context.db
      .query("workflow_jobs")
      .withIndex("by_jobId", (q) => q.eq("jobId", job.id))
      .unique();
    const document_ = {
      jobId: job.id,
      runId,
      repoId,
      repoFullName,
      name: job.name,
      status: job.status,
      conclusion: job.conclusion,
      startedAt: startedMs,
      completedAt: completedMs,
      durationMs,
      runnerName: job.runner_name,
      runnerGroupId: job.runner_group_id,
      runnerId: job.runner_id,
      labels: job.labels,
      attempt: job.run_attempt,
      htmlUrl: job.html_url,
      createdAt: startedMs ?? now,
      updatedAt: now,
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
    15;
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
