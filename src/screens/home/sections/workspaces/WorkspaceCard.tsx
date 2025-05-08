import { JazzListOfWorkspaces, JazzWorkspace } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import { memo, useState } from "react";
import { PreviewGridFlow } from "./WorkspaceCardPreview";
import { useWorkspaceActions } from "@/screens/workspace/.store/Workspace.store";
import { jazzNodesToGridNodes } from "@/lib/jazz/actions/jazzWorkspace";
import MoreIcon from "@/assets/icons/more.svg?react";
import TooltipModal, { TooltipItem } from "@/ui/modals/TooltipModal";
import RemoveIcon from "@/assets/icons/remove.svg?react";
import PencilIcon from "@/assets/icons/pencil-icon.svg?react";
import FolderAccordionTitle from "@/features/folders/FolderAccordionTitle";
import { useJazzProfileContext } from "@/lib/jazz/jazzProvider";

function WorkspaceCard(props: { workspace: JazzWorkspace }) {
  const { jazzProfile } = useJazzProfileContext();
  const { setWorkspaceOpen } = useModalStore();
  const { setActiveWorkspace } = useWorkspaceActions();
  const nodes = jazzNodesToGridNodes([
    ...(props.workspace.chats || []),
    ...(props.workspace.folders || []),
  ]);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPoisition, setTooltipPosition] = useState<null | {
    x: number;
    y: number;
  }>(null);

  const handleActionsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.bottom + window.scrollY + 8,
      y: rect.right + window.scrollX,
    });
    setShowTooltip(true);
  };

  const [titleEditable, setTitleEditable] = useState(false);

  const removeWorkspace = () => {
    const filteredWorkspaces = jazzProfile?.workspaces?.filter(
      (w) => w?.id !== props.workspace.id
    );
    if (filteredWorkspaces) {
      jazzProfile.workspaces = JazzListOfWorkspaces.create(filteredWorkspaces);
    }
  };
  return (
    <div
      onClick={() => {
        if (!showTooltip) {
          setWorkspaceOpen(true);
          setActiveWorkspace(props.workspace);
        }
      }}
      className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
    >
      <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none -z-10">
        <PreviewGridFlow
          id="preview"
          nodes={nodes}
          className="pointer-events-none"
        />
      </div>
      <div className="w-100 h-30 bg-transparent z-10"></div>

      <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center justify-between pl-2">
        <div className="text-xs font-medium text-hint">
          <FolderAccordionTitle
            value={props.workspace.title || ""}
            onBlur={(val) => {
              props.workspace.title = val;
              setTitleEditable(false);
            }}
            isFocused={titleEditable}
          />
        </div>
        <div
          className="p-1"
          onClick={(e) => {
            handleActionsClick(e);
          }}
        >
          <MoreIcon className="h-3 w-3 rotate-90 text-hint mr-2" />
        </div>
      </div>
      <TooltipModal
        isVisible={showTooltip}
        position={tooltipPoisition}
        handleClose={() => setShowTooltip(false)}
        side="left"
        className="mt-2"
      >
        <TooltipItem
          title={<div className="text-xs font-medium">Edit</div>}
          Icon={<PencilIcon className="h-4 w-4" />}
          action={() => {
            setTitleEditable(true);
          }}
          closeTooltip={() => setShowTooltip(false)}
        ></TooltipItem>
        <TooltipItem
          title={<div className="text-xs font-medium text-red-400">Remove</div>}
          Icon={<RemoveIcon className="h-3 w-3 text-red-400" />}
          action={() => removeWorkspace()}
          closeTooltip={() => setShowTooltip(false)}
        ></TooltipItem>
      </TooltipModal>
    </div>
  );
}

export default memo(WorkspaceCard);
