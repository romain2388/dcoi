import { createServerFn } from "@tanstack/react-start";
import { getCommunityStats } from "@server/functions/community";

export const getCommunityStatsController = createServerFn().handler(
  async () => {
    return await getCommunityStats();
  },
);
