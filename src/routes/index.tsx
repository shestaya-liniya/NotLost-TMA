import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Route as DialogsRoute } from "@/routes/_tab-bar/dialogs";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  router.navigate({ to: DialogsRoute.to });
}
