import { memo, useEffect, useRef, useState } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import MoreIcon from "@/assets/icons/more.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { JazzFolder } from "@/lib/jazz/schema";
import Tappable from "./Tappable";
import { AnimatePresence, motion } from "framer-motion";

function FolderAccordion({
  children,
  expanded,
  setExpanded,
  editingTitle,
  onBlur,
  foldersStack,
  returnToParentFolder,
  handleEditFolder,
  handleDeleteFolder,
}: {
  children: React.ReactNode;
  title: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  editingTitle: boolean;
  onBlur: (title: string) => void;
  foldersStack: JazzFolder[];
  returnToParentFolder: () => void;
  handleEditFolder: () => void;
  handleDeleteFolder: () => void;
}) {
  return (
    <div>
      <AccordionHeader
        foldersStack={foldersStack}
        toggleExpanded={() => setExpanded(!expanded)}
        expanded={expanded}
        setExpanded={setExpanded}
        editingTitle={editingTitle}
        onBlur={onBlur}
        returnToParentFolder={returnToParentFolder}
        handleEditFolder={handleEditFolder}
        handleDeleteFolder={handleDeleteFolder}
      />
      <div
        className={`${expanded ? "animate-fadeIn" : "absolute w-full animate-fadeOutHidden -left-0 px-4"} `}
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
  returnToParentFolder,
  handleEditFolder,
  handleDeleteFolder,
}: {
  toggleExpanded: () => void;
  expanded: boolean;
  editingTitle: boolean;
  onBlur: (title: string) => void;
  foldersStack: JazzFolder[];
  returnToParentFolder: () => void;
  setExpanded: (val: boolean) => void;
  handleEditFolder: () => void;
  handleDeleteFolder: () => void;
}) {
  const titleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
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
    <div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 duration-300 ease-in-out transition-all relative ${
          expanded ? "" : "rounded-bl-2xl rounded-br-2xl"
        }`}
        onClick={toggleExpanded}
      >
        <div></div>
        <div className="flex justify-between items-center">
          <div
            onClick={(event) => {
              event.stopPropagation();
              setShowTooltip((prev) => !prev);
            }}
          >
            <MoreIcon className="h-5 w-5 text-link" />
          </div>

          <span className="font-semibold flex items-center gap-1">
            <span className="text-hint">
              {foldersStack.length > 1 ? (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    returnToParentFolder();
                  }}
                >
                  <ChevronRightIcon className="h-3 w-3 rotate-180" />
                  {getFolderStack()}{" "}
                </div>
              ) : (
                <></>
              )}
            </span>
            <span
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
            </span>
          </span>

          <ChevronIcon
            className={`w-5 h-5 text-link transition-transform duration-300 ease-in-out ${expanded ? "-rotate-90" : "rotate-90"}`}
          />
        </div>
      </div>
      {showTooltip && (
        <FolderTooltip
          folder={foldersStack[-1]}
          showTooltip={showTooltip}
          closeTooltip={() => setShowTooltip(false)}
          handleDeleteFolder={handleDeleteFolder}
          handleEditFolder={handleEditFolder}
        />
      )}
    </div>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-4 px-4 pb-2 bg-secondary rounded-b-2xl animate-fadeIn border-l-2 border-r-2 border-b-2 border-primary/30">
      {children}
    </div>
  );
}

export const FolderTooltip = ({
  showTooltip,
  closeTooltip,
  handleEditFolder,
  handleDeleteFolder,
}: {
  folder: JazzFolder;
  showTooltip: boolean;
  closeTooltip: () => void;
  handleEditFolder: () => void;
  handleDeleteFolder: () => void;
}) => {

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (showTooltip) {
        event.preventDefault();
        closeTooltip();
      }
    };

    if (showTooltip) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [showTooltip, closeTooltip]);

  return (
    <AnimatePresence>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`absolute left-14 top-12  -translate-x-1/4 backdrop-blur-lg bg-primary bg-opacity-70 border-link/10 border-[2px] rounded-xl shadow-lg z-30`}
          onTouchStart={(event) => {
            event.stopPropagation();
          }}
        >
          <FolderToolTipItem
            Icon={
              <div className="text-link h-4 w-4">
                <PencilIcon />
              </div>
            }
            title={<div className="text-sm">Rename</div>}
            action={handleEditFolder}
            closeTooltip={closeTooltip}
          />
          <div className="h-[2px] bg-link/10"></div>
          <FolderToolTipItem
            Icon={
              <div className="text-red">
                <RemoveIcon className="text-red-400 w-4 h-4" />
              </div>
            }
            title={<div className="text-sm text-red-400">Delete</div>}
            action={handleDeleteFolder}
            closeTooltip={closeTooltip}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FolderToolTipItem = ({
  Icon,
  title,
  action,
  closeTooltip,
}: {
  Icon: React.ReactElement;
  title: React.ReactElement;
  action: () => void;
  closeTooltip: () => void;
}) => {
  return (
    <Tappable
      className=" p-2"
      onClick={() => {
        action();
        closeTooltip();
      }}
    >
      <div className="flex w-full items-center">
        {Icon}
        <div className="ml-2 text-left font-medium text-sm whitespace-nowrap">
          {title}
        </div>
      </div>
    </Tappable>
  );
};

export default memo(FolderAccordion);
