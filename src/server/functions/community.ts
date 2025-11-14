import { createServerOnlyFn } from "@tanstack/react-start";
import databaseConnect from "../db/mongoose";
import { walletModel } from "../db/schemas/wallet-schema";
import { projectModel } from "../db/schemas/project-schema";
import { workflowRunModel } from "../db/schemas/worflow-run-schema";
import { workflowJobModel } from "../db/schemas/worflow-job-schema";

export const getCommunityStats = createServerOnlyFn(async () => {
  await databaseConnect();

  // Community balance: sum of all wallet balances
  const wallets = await walletModel.find({ active: true });
  const communityBalance = wallets.reduce(
    (sum, wallet) => sum + wallet.balanceCredits,
    0,
  );

  // Funded projects: count of projects with proofOfRetirementUrl (funded)
  const fundedProjectsCount = await projectModel.countDocuments({
    proofOfRetirementUrl: { $exists: true, $ne: "" },
  });

  // Offset runs: count of all workflow runs
  const offsetRunsCount = await workflowRunModel.countDocuments();

  // Carbon offset: rough estimate, 0.5 kg CO2 per run
  const carbonOffset = offsetRunsCount * 0.5;

  // Total run time: sum of job durations in hours
  const jobs = await workflowJobModel.find({ durationMs: { $exists: true } });
  const totalRunTimeMs = jobs.reduce(
    (sum, job) => sum + (job.durationMs || 0),
    0,
  );
  const totalRunTimeHours = totalRunTimeMs / 1000 / 3600;

  return {
    communityBalance,
    fundedProjectsCount,
    offsetRunsCount,
    carbonOffset,
    totalRunTimeHours,
  };
});
