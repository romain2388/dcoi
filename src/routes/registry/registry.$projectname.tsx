import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/registry/registry/$projectname")({
  component: RegistryComponent,
});

function RegistryComponent() {
  return <div></div>;
}
