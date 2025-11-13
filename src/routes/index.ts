import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@client/components/home";

export const Route = createFileRoute("/")({
  component: Home,
});
