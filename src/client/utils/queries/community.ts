import { queryOptions } from "@tanstack/react-query";
import { getCommunityStatsController } from "@controller/functions/community";

export const communityStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["communityStats"],
    queryFn: () => getCommunityStatsController(),
  });
