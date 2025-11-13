import { createServerFn } from "@tanstack/react-start";
import { getRepoOverviewSchema } from "@controller/dto/repos";

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
