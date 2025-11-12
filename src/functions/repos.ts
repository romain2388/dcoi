import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRepoOverviewSchema, upsertRepoSchema } from "../dto/repos";
import { repoModel } from "../db/schemas/repo-schema";
import { accountModel } from "../db/schemas/account-schema";
import { walletModel } from "../db/schemas/wallet-schema";
import { workflowRunModel } from "../db/schemas/worflow-run-schema";
import { getInstallationOctokit, paginateAll } from "../utilities.github";

export const upsertRepo = createServerOnlyFn(
  async (arguments_: {
    repoId: number;
    fullName: string;
    name: string;
    ownerId: number;
    private: boolean;
    visibility?: string;
  }) => {
    const validated = upsertRepoSchema.parse(arguments_);

    const existing = await repoModel.findOne({
      repoId: validated.repoId,
    });
    if (existing) {
      return repoModel.findByIdAndUpdate(existing._id, validated);
    }
    return await repoModel.create(validated);
  },
);

export const getRepoOverview = createServerFn()
  .inputValidator(getRepoOverviewSchema)
  .handler(async ({ data }) => {
    const repo = await repoModel.findOne({
      fullName: data.repoFullName,
    });

    const account = await accountModel.findOne({
      githubAccountId: repo.ownerId,
    });

    const wallet = await walletModel.findOne({
      accountId: repo.ownerId,
    });

    const runs = await workflowRunModel.find({ repoId: repo.repoId });

    const recentRuns = data.limitRuns ? runs.slice(0, data.limitRuns) : runs;

    const communityWallet = await walletModel.findOne();

    if (!communityWallet) {
      throw new Error("Community wallet not found");
    }

    return {
      repo,
      owner: account,
      wallet,
      recentRuns,
      communityCredits: communityWallet.balanceCredits,
    };
  });

export const syncInstallationRepos = createServerOnlyFn(
  async (data: { installationId: number; accountId: number }) => {
    const octokit = await getInstallationOctokit(data.installationId);
    const repos = await paginateAll<any>(
      octokit,
      octokit.rest.apps.listReposAccessibleToInstallation,
      {},
    );
    const mapped = repos.map((r) => ({
      repoId: r.id,
      fullName: r.full_name,
      name: r.name,
      private: !!r.private,
      ownerId: r.owner.id,
    }));
    for (const r of mapped) {
      await upsertRepo(r);
    }
  },
);
