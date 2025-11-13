import { createFileRoute } from "@tanstack/react-router";
import { AdminHome } from "@client/components/admin/admin-home";

export const Route = createFileRoute("/(client)/admin/")({
  component: AdminHome,
});
