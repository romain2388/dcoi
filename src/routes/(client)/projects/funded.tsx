import { createFileRoute } from "@tanstack/react-router";
import { FundedProjects } from "@client/components/projects/funded-projects";
import { fundedProjectsQueryOptions } from "@client/utils/queries/projects";

export const Route = createFileRoute("/(client)/projects/funded")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(fundedProjectsQueryOptions());
  },
  component: FundedProjects,
});
