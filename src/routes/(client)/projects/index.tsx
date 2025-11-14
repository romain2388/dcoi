import { createFileRoute } from "@tanstack/react-router";
import { ProjectsIndex } from "@client/components/projects/projects-index";
import { adminProjectsQueryOptions } from "@client/utils/queries/projects";

export const Route = createFileRoute("/(client)/projects/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adminProjectsQueryOptions());
  },
  component: ProjectsIndex,
});
