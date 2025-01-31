import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_tab-bar/try/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_tab-bar/try/!</div>;
}
