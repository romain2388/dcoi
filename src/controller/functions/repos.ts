import { createServerFn } from "@tanstack/react-start";
import { getRepoOverviewSchema } from "@controller/dto/repos";
import { getRepoOverviewService } from "@server/functions/repos";

export const getRepoOverview = createServerFn()
  .inputValidator(getRepoOverviewSchema)
  .handler(async ({ data }) => {
    return getRepoOverviewService(data.repoFullName);
  });
