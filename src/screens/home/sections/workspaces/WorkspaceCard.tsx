import { JazzWorkspace } from "@/lib/jazz/schema";
import { useModalStore } from "@/lib/store/modalStore";
import Tappable from "@/ui/Tappable";
import { memo } from "react";
import { PreviewGridFlow } from "./WorkspaceCardPreview";
import { useWorkspaceActions } from "@/screens/workspace/.store/Workspace.store";
import { jazzNodesToGridNodes } from "@/lib/jazz/actions/jazzWorkspace";

function WorkspaceCard(props: { workspace: JazzWorkspace }) {
  const { setWorkspaceOpen } = useModalStore();
  const { setActiveWorkspace } = useWorkspaceActions();
  const nodes = jazzNodesToGridNodes([
    ...(props.workspace.chats || []),
    ...(props.workspace.folders || []),
  ]);

  return (
    <Tappable
      onClick={() => {
        setWorkspaceOpen(true);
        setActiveWorkspace(props.workspace);
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

      <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
        <div className="text-xs font-medium text-hint">
          {props.workspace.title}
        </div>
      </div>
    </Tappable>
  );
}

export default memo(WorkspaceCard);
