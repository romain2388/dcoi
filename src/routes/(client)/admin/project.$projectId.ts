import { createFileRoute } from "@tanstack/react-router";
import { AdminProjectFormComponent } from "@client/components/admin/admin-project-form";
import { getProjectByIdQueryOptions } from "@client/tanstack/queries/projects";

export const Route = createFileRoute("/(client)/admin/project/$projectId")({
  loader: async ({ context, params: { projectId } }) => {
    await context.queryClient.ensureQueryData(
      getProjectByIdQueryOptions(projectId),
    );
  },
  component: AdminProjectFormComponent,
});
