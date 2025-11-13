import { Webhooks } from "@octokit/webhooks";
import { createServerOnlyFn } from "@tanstack/react-start";
import { feedCarbon, upsertAccount, upsertMarketplace } from "./accounts";
import { upsertInstallation } from "./installations";
import { upsertWorkflowJob, upsertWorkflowRun } from "./workflows";
import { syncInstallationRepos } from "./repos";

export const handleWebhooks = createServerOnlyFn(async (request) => {
  const webhooks = new Webhooks({
    secret: "mysecret",
  });

  webhooks.on("installation", async (event) => {
    const inst = event.payload.installation;
    const account = inst.account;
    if (!account) return;
    await upsertAccount({
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
    await upsertInstallation({
      installationId: inst.id,
      accountId: event.payload.organization
        ? event.payload.organization.id
        : event.payload.sender.id,
    });
    if (event.payload.action === "created") {
      await syncInstallationRepos({
        installationId: inst.id,
        accountId: event.payload.organization
          ? event.payload.organization.id
          : event.payload.sender.id,
      });
    }
  });

  webhooks.on("installation_repositories", async (event) => {
    const inst = event.payload.installation;
    if (!inst.account) return;
    await syncInstallationRepos({
      installationId: inst.id,
      accountId: inst.account.id,
    });
  });

  webhooks.on("marketplace_purchase", async (event) => {
    const mp = event.payload.marketplace_purchase;
    const account = mp.account;
    await upsertAccount({
      githubAccountId: account.id,
      accountLogin: account.login,
      accountType: account.type as "User" | "Organization",
    });
    if (
      event.payload.action === "purchased" ||
      event.payload.action === "changed"
    ) {
      await upsertMarketplace({
        accountId: account.id,
        planId: mp.plan.id,
        planName: mp.plan.name,
        billingCycle: mp.billing_cycle as "monthly" | "yearly",
        nextBillingDate: mp.next_billing_date ?? undefined,
      });

      await feedCarbon({
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

      await upsertWorkflowRun({
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
      await upsertWorkflowJob({
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

  await webhooks
    .verifyAndReceive({
      id: request.getRequestHeader("x-github-delivery"),
      name: request.headers["x-github-event"],
      payload: await request.json(),
      signature: request.headers["x-hub-signature-256"],
    })
    .catch();
});
