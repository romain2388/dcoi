import { createFileRoute } from "@tanstack/react-router";
import { VotingProjects } from "@client/components/projects/voting-projects";
import { votingProjectsQueryOptions } from "@client/utils/queries/projects";

export const Route = createFileRoute("/(client)/projects/voting")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(votingProjectsQueryOptions());
  },
  component: VotingProjects,
});
