import { createFileRoute } from "@tanstack/react-router";
import { Community } from "@client/components/community/community";
import { communityStatsQueryOptions } from "@client/utils/queries/community";

export const Route = createFileRoute("/(client)/community")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(communityStatsQueryOptions());
  },
  component: Community,
});
