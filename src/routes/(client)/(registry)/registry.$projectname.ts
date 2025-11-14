import { createFileRoute } from "@tanstack/react-router";
import { RegistryComponent } from "@client/components/registry/registry";
import { getProjectByIdQueryOptions } from "@client/utils/queries/projects";

export const Route = createFileRoute(
  "/(client)/(registry)/registry/$projectname",
)({
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getProjectByIdQueryOptions(params.projectname),
    );
  },
  component: RegistryComponent,
});
