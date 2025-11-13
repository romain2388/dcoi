import { createFileRoute } from "@tanstack/react-router";
import { AdminProjects } from "@client/components/admin/admin-projects";
import { adminProjectsQueryOptions } from "@client/tanstack/queries/projects";

export const Route = createFileRoute("/(client)/admin/projects")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adminProjectsQueryOptions());
  },
  component: AdminProjects,
});
