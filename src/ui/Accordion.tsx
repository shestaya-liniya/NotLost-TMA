import { memo, useEffect, useRef } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import Tappable from "./Tappable";

function Accordion({
  children,
  title,
  expanded,
  setExpanded,
  updateHeight,
}: {
  children: React.ReactNode;
  title: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  updateHeight: (height: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      updateHeight(ref.current.clientHeight);
    }
  }, [expanded]);
  return (
    <div ref={ref}>
      <Tappable>
        <AccordionHeader
          title={title}
          toggleExpanded={() => setExpanded(!expanded)}
          expanded={expanded}
        />
        {expanded && <AccordionContent>{children}</AccordionContent>}
      </Tappable>
    </div>
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
      onTouchStart={toggleExpanded}
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
