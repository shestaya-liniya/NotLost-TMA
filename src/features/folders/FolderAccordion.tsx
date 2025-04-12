import { memo, useEffect, useState } from "react";
import ChevronIcon from "@/assets/icons/chevron-right.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import MoreIcon from "@/assets/icons/more.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import { createPortal } from "react-dom";
import FolderAccordionTitle from "./FolderAccordionTitle";
import { v4 as uuid } from "uuid";
import FolderAccordionTooltip, {
  FolderAccordionToolTipItem,
} from "./FolderAccordionTooltip";
import { JazzFolder } from "@/lib/jazz/schema";
import TelegramAvatar from "@/ui/TelegramAvatar";

function FolderAccordion(props: {
  children: React.ReactNode;
  title: string;
  prevFolder?: JazzFolder | null;
  previewUsersAvatars: { username: string }[];
  returnToPrevFolder?: () => void;
  saveTitle: (val: string) => void;
  deleteFolder: () => void;
  setAsMainFolder?: () => void;
  shouldSetAsMainFolder?: boolean | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandAnimated, setExpandAnimated] = useState(false);
  const [prevExpanded, setPrevExpanded] = useState<boolean | null>(null);

  useEffect(() => {
    setPrevExpanded(!expanded);
    if (expanded) {
      setTimeout(() => {
        setExpandAnimated(true);
      }, 300);
    }
  }, [expanded]);
  return (
    <>
      <FolderAccordionHeader
        title={props.title}
        prevFolder={props.prevFolder || null}
        expanded={expanded}
        previewUsersAvatars={props.previewUsersAvatars}
        onClick={() => {
          if (props.shouldSetAsMainFolder) {
            props.setAsMainFolder?.();
          } else {
            setExpanded(!expanded);
          }
        }}
        returnToPrevFolder={props.returnToPrevFolder}
        saveTitle={props.saveTitle}
        deleteFolder={props.deleteFolder}
      />
      {prevExpanded !== null && (
        <div
          className={`${expanded && !expandAnimated ? "animate-fadeIn" : expanded ? "transition-none opacity-100" : "hidden"} `}
        >
          <AccordionContent>{props.children}</AccordionContent>
        </div>
      )}
    </>
  );
}

function FolderAccordionHeader(props: {
  title: string;
  expanded: boolean;
  prevFolder: JazzFolder | null;
  previewUsersAvatars: { username: string }[];
  onClick: () => void;
  returnToPrevFolder?: () => void;
  saveTitle: (val: string) => void;
  deleteFolder: () => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleActionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX + 14,
    });
    setShowTooltip(true);
  };

  return (
    <div>
      <div
        className={`rounded-tl-2xl rounded-tr-2xl bg-primary px-6 py-4 duration-300 ease-in-out transition-all relative ${
          props.expanded ? "" : "rounded-bl-2xl rounded-br-2xl"
        }`}
        onClick={props.onClick}
      >
        <div className="flex justify-between items-center">
          <div
            onClick={(event) => {
              handleActionsClick(event);
            }}
          >
            <MoreIcon className="h-5 w-5 text-link" />
          </div>

          <span className="font-semibold flex items-center gap-1">
            <span className="text-hint">
              {props.prevFolder && (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.returnToPrevFolder?.();
                  }}
                >
                  <ChevronRightIcon className="h-3 w-3 rotate-180" />
                  {props.prevFolder.title}
                  {" / "}
                </div>
              )}
            </span>
            <FolderAccordionTitle
              onBlur={(val) => props.saveTitle(val)}
              isFocused={isRenaming}
              value={props.title}
            />
          </span>
          <ChevronIcon
            className={`w-5 h-5 text-link transition-transform duration-300 ease-in-out ${props.expanded ? "-rotate-90" : "rotate-90"}`}
          />
        </div>
        {!props.expanded && (
          <div
            className={`flex justify-center relative ${props.previewUsersAvatars.length === 2 && "left-2"} ${props.previewUsersAvatars.length === 3 && "left-4"}`}
          >
            {props.previewUsersAvatars.map((user, index) => {
              return (
                <div
                  key={uuid()}
                  className={`${index === 1 && "relative right-4"} ${index === 2 && "relative right-8"}`}
                >
                  <TelegramAvatar username={user.username} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showTooltip &&
        createPortal(
          <FolderAccordionTooltip
            isVisible={showTooltip}
            handleClose={() => setShowTooltip(false)}
            position={tooltipPosition}
          >
            <>
              <FolderAccordionToolTipItem
                Icon={<PencilIcon className="text-link h-4 w-4" />}
                title={<div className="text-sm">Rename</div>}
                action={() => setIsRenaming(true)}
                closeTooltip={() => setShowTooltip(false)}
              />
              <div className="h-[2px] bg-link/10"></div>
              <FolderAccordionToolTipItem
                Icon={<RemoveIcon className="text-red-400 w-4 h-4" />}
                title={<div className="text-sm text-red-400">Delete</div>}
                action={props.deleteFolder}
                closeTooltip={() => setShowTooltip(false)}
              />
            </>
          </FolderAccordionTooltip>,
          document.body
        )}
    </div>
  );
}

function AccordionContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-4 px-4 pb-2 bg-secondary rounded-b-2xl border-l-2 border-r-2 border-b-2 border-primary/30">
      {children}
    </div>
  );
}

export default memo(FolderAccordion);
