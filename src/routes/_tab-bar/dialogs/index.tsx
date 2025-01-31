import { createFileRoute } from "@tanstack/react-router";
import { Accordion } from "@telegram-apps/telegram-ui";
import { AccordionContent } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionContent/AccordionContent";
import { AccordionSummary } from "@telegram-apps/telegram-ui/dist/components/Blocks/Accordion/components/AccordionSummary/AccordionSummary";
import { useState } from "react";

export const Route = createFileRoute("/_tab-bar/dialogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="pt-10 pr-4 pl-4">
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded((prev) => !prev);
        }}
      >
        <AccordionSummary className="rounded-xl bg-primary">
          Hey
        </AccordionSummary>
        <AccordionContent>Yo</AccordionContent>
      </Accordion>
    </div>
  );
}
