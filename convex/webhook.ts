"use node";
import { v } from "convex/values";
import { Webhooks } from "@octokit/webhooks";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const handleWebhooks = internalAction({
  args: { request: v.any() },
  handler: async (context, { request }) => {
    const webhooks = new Webhooks({
      secret: "mysecret",
    });

    webhooks.on("installation", async (event) => {
      const inst = event.payload.installation; // { id, account, repository_selection, suspended_by? }
      const account = inst.account; // { id, login, type }
      if (!account) return;
      await context.runMutation(internal.accounts.upsertAccount, {
        githubAccountId: event.payload.organization
          ? event.payload.organization.id
          : event.payload.sender.id,
        avatarUrl: event.payload.organization
          ? event.payload.organization.avatar_url
          : event.payload.sender.avatar_url,
        htmlUrl: event.payload.organization
          ? event.payload.organization.url
          : event.payload.sender.html_url,
        accountName: event.payload.organization
          ? (event.payload.organization.description ?? "")
          : (event.payload.sender.name ?? ""),
        accountLogin: event.payload.organization
          ? event.payload.organization.login
          : event.payload.sender.login,
        accountType: event.payload.organization ? "Organization" : "User",
      });
      await context.runMutation(internal.installations.upsertInstallation, {
        installationId: inst.id,
        accountId: event.payload.organization
          ? event.payload.organization.id
          : event.payload.sender.id,
      });
      if (event.payload.action === "created") {
        await context.runAction(internal.wnode.syncInstallationRepos, {
          installationId: inst.id,
          accountId: event.payload.organization
            ? event.payload.organization.id
            : event.payload.sender.id,
        });
      }
    });

    webhooks.on("installation_repositories", async (event) => {
      const inst = event.payload.installation; // { id, account }
      if (!inst.account) return;
      await context.runAction(internal.wnode.syncInstallationRepos, {
        installationId: inst.id,
        accountId: inst.account.id,
      });
    });

    webhooks.on("marketplace_purchase", async (event) => {
      const mp = event.payload.marketplace_purchase;
      const account = mp.account; // { id, login, type, avatar_url?, html_url? }
      await context.runMutation(internal.accounts.upsertAccount, {
        githubAccountId: account.id,
        accountLogin: account.login,
        accountType: account.type as "User" | "Organization",
      });
      if (
        event.payload.action === "purchased" ||
        event.payload.action === "changed"
      ) {
        await context.runMutation(internal.accounts.upsertMarketplace, {
          accountId: account.id,
          planId: mp.plan.id,
          planName: mp.plan.name,
          billingCycle: mp.billing_cycle as "monthly" | "yearly",
          nextBillingDate: mp.next_billing_date ?? undefined,
        });

        await context.runMutation(internal.accounts.feedCarbon, {
          accountId: account.id,
          planId: mp.plan.id,
          billingCycle: mp.billing_cycle as "monthly" | "yearly",
        });
      }
    });

    webhooks.on("workflow_run", async (event) => {
      if (event.payload.action === "completed") {
        const instId = event.payload.installation?.id;
        if (!instId) return;
        const repoFull = event.payload.repository.full_name;
        const run = event.payload.workflow_run;

        await context.runMutation(internal.workflows.upsertWorkflowRun, {
          accountId: event.payload.repository.owner.id,
          repoId: event.payload.repository.id,
          repoFullName: repoFull,
          runId: run.id,
          name: run.name ?? "",
          headbranch: run.head_branch ?? "",
          conclusion: run.conclusion ?? "",
          createdAt: run.created_at,
        });
      }
    });

    webhooks.on("workflow_job", async (event) => {
      if (event.payload.action === "completed") {
        const repoId = event.payload.repository.id;
        const job = event.payload.workflow_job;
        await context.runMutation(internal.workflows.upsertWorkflowJob, {
          jobId: job.id,
          name: job.name,
          conclusion: job.conclusion,
          runId: job.run_id,
          durationMs: Date.parse(job.completed_at) - Date.parse(job.started_at),
          completedAt: job.completed_at,
          repoId: repoId,
        });
      }
    });

    // put this inside your webhooks route handler
    webhooks
      .verifyAndReceive({
        id: request.headers["x-github-delivery"],
        name: request.headers["x-github-event"],
        payload: request.body,
        signature: request.headers["x-hub-signature-256"],
      })
      .catch();
  },
});
