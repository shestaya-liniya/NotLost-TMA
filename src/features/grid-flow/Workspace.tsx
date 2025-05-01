import { memo, useEffect, useState } from "react";
import GridFlow from "./GridFlow";
import GrabIcon from "@/assets/icons/cursor-grab.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PinIcon from "@/assets/icons/pin.svg?react";

import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import MiniAppTopMenu, {
  MiniAppTopMenuItem,
  MiniAppTopMenuDivider,
} from "@/ui/MiniAppTopMenu";
import { useWorkspaceStore } from "./WorkspaceStore";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { ReactFlowProvider, useNodesState } from "@xyflow/react";
import { initNodes } from "./nodes/GridFlowNodes";
import WorkspaceTopButton from "./WorkspaceTopButton";
import WorkspaceAddModal from "./WorkspaceAddModal";

function Workspace() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);

  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    nodesDraggable,
    setNodesDraggable,
    deleteModeEnabled,
    setDeleteModeEnabled,
  } = useWorkspaceStore();
  const topButtonActive = nodesDraggable || deleteModeEnabled;

  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) => {
        return {
          ...n,
          data: {
            ...n.data,
            deleteMode: deleteModeEnabled,
          },
        };
      })
    );
  }, [deleteModeEnabled]);

  return (
    <div className="h-screen relative">
      <div
        className="relative w-screen"
        style={{
          top: getMiniAppTopInset(),
        }}
      >
        <GridFlow
          key={"fullscreen"}
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
        />
      </div>

      <MiniAppTopButton
        active={topButtonActive}
        onClick={() => {
          if (nodesDraggable) {
            setNodesDraggable(false);
          } else if (deleteModeEnabled) {
            setDeleteModeEnabled(false);
          } else {
            setShowMenu(true);
          }
        }}
      >
        <WorkspaceTopButton menuShown={showMenu} />
      </MiniAppTopButton>
      <MiniAppTopMenu show={showMenu} setShow={setShowMenu}>
        <MiniAppTopMenuItem
          action={() => {
            setNodesDraggable(!nodesDraggable);
            setShowMenu(false);
          }}
          active={nodesDraggable}
        >
          <div>Move</div>
          <GrabIcon className="w-6 h-6" />
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem
          action={() => {
            setDeleteModeEnabled(!deleteModeEnabled);
            setShowMenu(false);
          }}
          active={deleteModeEnabled}
        >
          <div>Unpin</div>
          <div className="relative">
            <PinIcon className="w-4 h-4 ml-2 relative right-1" />
            <div className="absolute -top-[7px] left-[9px] -rotate-60 text-lg font-light">
              /
            </div>
          </div>
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem
          action={() => {
            setShowAddModal(true);
            setShowMenu(false);
          }}
        >
          <div>Add</div>
          <PlusIcon className="w-6 h-6" />
        </MiniAppTopMenuItem>
      </MiniAppTopMenu>
      <div></div>
      <WorkspaceAddModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        nodes={nodes}
        setNodes={setNodes}
      />
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default memo(() => (
  <ReactFlowProvider>
    <Workspace />
  </ReactFlowProvider>
));
