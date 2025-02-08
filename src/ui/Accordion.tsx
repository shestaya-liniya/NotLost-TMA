import { memo } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Tappable from "./Tappable";

function Accordion({
  children,
  title,
  expanded,
  setExpanded,
}: {
  children: React.ReactNode;
  title: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}) {
  return (
    <Tappable>
      <AccordionHeader
        title={title}
        toggleExpanded={() => setExpanded(!expanded)}
        expanded={expanded}
      />
      <div
        className={`transition-height duration-150 ease-in-out ${
          expanded ? "h-20 opacity-100" : "h-0 opacity-0"
        }`}
      >
        <AccordionContent>{children}</AccordionContent>
      </div>
    </Tappable>
  );
}

function AccordionHeader({
  title,
  toggleExpanded,
  expanded,
}: {
  title: string;
  toggleExpanded: () => void;
  expanded: boolean;
}) {
  return (
    <div
      className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 duration-300 ease-in-out transition-all ${
        expanded ? "" : "rounded-bl-2xl rounded-br-2xl"
      }`}
      onClick={toggleExpanded}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FolderIcon className="w-7 h-7 text-link" />
          <div className="font-bold">{title}</div>
        </div>
        <ChevronIcon
          className={`w-5 h-5 text-link transition-transform duration-300 ease-in-out ${expanded ? "-rotate-90" : "rotate-90"}`}
        />
      </div>
    </div>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-secondary rounded-b-2xl animate-fadeIn">
      {children}
    </div>
  );
}

export default memo(Accordion);
