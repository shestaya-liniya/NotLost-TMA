import { memo, useEffect, useRef } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import FolderIcon from "@/assets/icons/folder.svg?react";
import FolderOpenIcon from "@/assets/icons/folder-open.svg?react";
import { JazzFolder } from "@/lib/jazz/schema";
import Tappable from "./Tappable";

function FolderAccordion({
  children,
  expanded,
  setExpanded,
  editingTitle,
  onBlur,
  foldersStack,
}: {
  children: React.ReactNode;
  title: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  editingTitle: boolean;
  onBlur: (title: string) => void;
  foldersStack: JazzFolder[];
}) {
  return (
    <div>
      <AccordionHeader
        foldersStack={foldersStack}
        toggleExpanded={() => setExpanded(!expanded)}
        expanded={expanded}
        editingTitle={editingTitle}
        onBlur={onBlur}
      />
      <div
        className={`${expanded ? "animate-fadeIn" : "absolute w-full animate-fadeOutHidden -left-0 px-2"} `}
      >
        <AccordionContent>{children}</AccordionContent>
      </div>
    </div>
  );
}

function AccordionHeader({
  toggleExpanded,
  expanded,
  editingTitle,
  onBlur,
  foldersStack,
}: {
  toggleExpanded: () => void;
  expanded: boolean;
  editingTitle: boolean;
  onBlur: (title: string) => void;
  foldersStack: JazzFolder[];
}) {
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editingTitle && titleRef.current) {
      const el = titleRef.current;
      el.focus();
      const range = document.createRange();
      const sel = window.getSelection();

      if (sel) {
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [editingTitle]);

  const getFolderStack = () => {
    if (foldersStack.length === 1) {
      return;
    }
    return foldersStack.slice(0, -1).map((folder) => folder.title + " / ");
  };

  return (
    <Tappable>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 duration-300 ease-in-out transition-all ${
          expanded ? "" : "rounded-bl-2xl rounded-br-2xl"
        }`}
        onClick={toggleExpanded}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {expanded ? (
              <FolderOpenIcon className="w-7 h-7 text-link " />
            ) : (
              <FolderIcon className="w-7 h-7 text-link" />
            )}
            <div className="flex gap-1">
              <div className="font-semibold text-hint">{getFolderStack()}</div>
              <div
                ref={titleRef}
                className="font-semibold outline-none"
                contentEditable={editingTitle}
                onBlur={() => {
                  if (editingTitle) {
                    onBlur(titleRef.current?.innerText || "");
                  }
                }}
              >
                {foldersStack[foldersStack.length - 1].title}
              </div>
            </div>
          </div>
          <ChevronIcon
            className={`w-5 h-5 text-link transition-transform duration-300 ease-in-out ${expanded ? "-rotate-90" : "rotate-90"}`}
          />
        </div>
      </div>
    </Tappable>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-secondary rounded-b-2xl animate-fadeIn">
      {children}
    </div>
  );
}

export default memo(FolderAccordion);
