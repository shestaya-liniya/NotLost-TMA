import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@telegram-apps/telegram-ui";

export const Route = createFileRoute("/_tab-bar/dialogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button mode="bezeled">Hello</Button>
    </div>
  );
}
