import { createFileRoute } from "@tanstack/react-router";
import { RegistryComponent } from "@client/components/registry/registry";

export const Route = createFileRoute(
  "/(client)/(registry)/registry/$projectname",
)({
  component: RegistryComponent,
});
