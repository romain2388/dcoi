import { queryOptions } from "@tanstack/react-query";
import { getRepoOverview } from "@controller/functions/repos";
import { getRepoRunsWithPaginationController } from "@controller/functions/workflows";

export const repoOverviewQueryOptions = (repoFullName: string) =>
  queryOptions({
    queryKey: ["repoOverview", repoFullName],
    queryFn: () => getRepoOverview({ data: { repoFullName } }),
  });

export const repoRunsQueryOptions = (
  repoFullName: string,
  page: number = 1,
  limit: number = 10,
) =>
  queryOptions({
    queryKey: ["repoRuns", repoFullName, page, limit],
    queryFn: () =>
      getRepoRunsWithPaginationController({
        data: { repoFullName, page, limit },
      }),
  });
