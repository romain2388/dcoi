"use node";
import { v } from "convex/values";
import { Webhooks } from "@octokit/webhooks";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { verifyWebhookSignature } from "./utilities.github";

export const handleWebhooks = internalAction({
  args: { request: v.any() },
  handler: async (context, { request }) => {
    const delivery =
      request.headers.get("x-github-delivery") || crypto.randomUUID();
    const event = (request.headers.get("x-github-event") || "").toLowerCase();
    const action =
      (request.headers.get(
        "x-github-hook-installation-target-type",
      ) as string) || undefined; // will also parse from body below
    const sig = request.headers.get("x-hub-signature-256");

    const raw = await request.arrayBuffer();
    const ok = await verifyWebhookSignature(raw, sig);
    if (!ok) return new Response("invalid signature", { status: 401 });

    const body = JSON.parse(Buffer.from(raw).toString("utf8"));
    const eventAction = body.action as string | undefined;

    // idempotence (store by delivery id)
    const fresh = await context.runMutation(
      internal.installations.recordWebhookDelivery,
      { deliveryId: delivery, event, action: eventAction },
    );
    if (!fresh) return new Response("duplicate", { status: 200 });

    switch (event) {
      case "ping": {
        return new Response("pong", { status: 200 });
      }

      case "installation": {
        const inst = body.installation; // { id, account, repository_selection, suspended_by? }
        const account = inst.account; // { id, login, type }
        await context.runMutation(internal.accounts.upsertAccount, {
          githubAccountId: account.id,
          accountLogin: account.login,
          accountType: account.type,
        });
        await context.runMutation(internal.accounts.patchAccountDetails, {
          githubAccountId: account.id,
          accountLogin: account.login,
          accountType: account.type,
          avatarUrl: account.avatar_url,
          htmlUrl: account.html_url,
          accountName: account.name,
        });
        await context.runMutation(internal.installations.upsertInstallation, {
          installationId: inst.id,
          accountId: account.id,
          accountLogin: account.login,
          accountType: account.type,
          repository_selection: inst.repository_selection,
          suspended: Boolean(inst.suspended_by),
        });
        if (body.action === "created") {
          await context.runAction(internal.wnode.syncInstallationRepos, {
            installationId: inst.id,
            accountId: account.id,
          });
        }
        break;
      }

      case "installation_repositories": {
        const inst = body.installation; // { id, account }
        await context.runAction(internal.wnode.syncInstallationRepos, {
          installationId: inst.id,
          accountId: inst.account.id,
        });
        return new Response("ok", { status: 200 });
      }

      case "marketplace_purchase": {
        const mp = body.marketplace_purchase;
        const account = mp.account; // { id, login, type, avatar_url?, html_url? }
        await context.runMutation(internal.accounts.upsertAccount, {
          githubAccountId: account.id,
          accountLogin: account.login,
          accountType: account.type,
        });
        await context.runMutation(internal.accounts.patchAccountDetails, {
          githubAccountId: account.id,
          accountLogin: account.login,
          accountType: account.type,
          avatarUrl: account.avatar_url,
          htmlUrl: account.html_url,
          accountName: account.name,
        });
        if (eventAction === "purchased" || eventAction === "changed") {
          await context.runMutation(internal.accounts.upsertMarketplace, {
            accountId: account.id,
            planId: mp.plan.id,
            planName: mp.plan.name,
            priceModel: mp.plan.price_model,
            unitName: mp.plan.unit_name ?? undefined,
            unitCount: mp.unit_count ?? undefined,
            billingCycle: mp.billing_cycle ?? undefined,
            onFreeTrial: mp.on_free_trial ?? undefined,
            freeTrialEndsOn: mp.free_trial_ends_on ?? undefined,
            nextBillingDate: mp.next_billing_date ?? undefined,
            effectiveDate: mp.effective_date ?? undefined,
          });
        }
        break;
      }

      case "workflow_run": {
        const instId = body.installation?.id as number | undefined;
        if (!instId) break;
        const repo = body.repository.name as string;
        const owner = body.repository.owner.login as string;
        const repoFull = body.repository.full_name as string;
        const run = body.workflow_run;
        // Assurer la présence du repo en base
        await context.runMutation(internal.repos.upsertRepo, {
          repoId: body.repository.id,
          fullName: repoFull,
          name: repo,
          ownerId: body.repository.owner.id,
          ownerLogin: owner,
          ownerType: body.repository.owner.type,
          private: !!body.repository.private,
          visibility: body.repository.visibility ?? undefined,
          defaultBranch: body.repository.default_branch ?? undefined,
          htmlUrl: body.repository.html_url ?? undefined,
          archived: !!body.repository.archived,
        });

        await context.runMutation(internal.workflows.upsertWorkflowRun, {
          accountId: body.installation.account.id,
          installationId: instId,
          repoId: body.repository.id,
          repoFullName: repoFull,
          run: {
            id: run.id,
            name: run.name,
            head_sha: run.head_sha,
            head_branch: run.head_branch,
            status: run.status,
            conclusion: run.conclusion,
            event: run.event,
            html_url: run.html_url,
            created_at: run.created_at,
            updated_at: run.updated_at,
            run_started_at: run.run_started_at,
            run_attempt: run.run_attempt,
          },
        });

        break;
      }

      case "workflow_job": {
        const instId = body?.installation?.id as number | undefined;
        if (!instId) break;
        const repo = body.repository.name as string;
        const owner = body.repository.owner.login as string;
        const repoFull = body.repository.full_name as string;
        const job = body.workflow_job;
        await context.runMutation(internal.workflows.upsertWorkflowJob, {
          accountId: body.installation.account.id,
          installationId: instId,
          repoId: body.repository.id,
          repoFullName: repoFull,
          runId: job.run_id,
          job: {
            id: job.id,
            name: job.name,
            status: job.status,
            conclusion: job.conclusion,
            started_at: job.started_at,
            completed_at: job.completed_at,
            runner_name: job.runner_name,
            runner_group_id: job.runner_group_id,
            runner_id: job.runner_id,
            labels: job.labels,
            run_attempt: job.run_attempt,
            html_url: job.html_url,
            steps: job.steps?.map((s: any) => ({
              name: s.name,
              status: s.status,
              conclusion: s.conclusion,
              number: s.number,
              started_at: s.started_at,
              completed_at: s.completed_at,
            })),
          },
        });
        break;
      }

      default: {
        break;
      }
    }
  },
});
