import { memo, useEffect, useRef, useState } from "react";
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
import BottomModal from "@/ui/modals/BottomModal";
import DuckIcon from "@/assets/icons/duck-rubber.svg?react";
import { ReactFlowProvider, useNodesState } from "@xyflow/react";
import { initNodes } from "./nodes/GridFlowNodes";
import Tappable from "@/ui/Tappable";
import { findFreeSpace } from "./GridFlowUtils";
import { GridFlowNode } from "./GridFlowInterface";
import { v4 } from "uuid";
import WorkspaceTopButton from "./WorkspaceTopButton";

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
  const modalRef = useRef<HTMLDivElement>(null);

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
      <BottomModal
        id="workspace-add-modal"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="New"
        className="pb-8"
      >
        <div ref={modalRef}>
          <div className="text-xs text-hint font-medium pl-2 pb-2">Blocks</div>
          <div className="relative">
            <Tappable
              onTap={() => {
                const freeSpace = findFreeSpace(nodes, 2, 2);
                if (freeSpace) {
                  const newNodeId = v4();
                  const newNode: GridFlowNode = {
                    id: newNodeId,
                    type: "chat",
                    data: {
                      username: "shestaya_liniya",
                      name: "Andrei",
                    },
                    position: freeSpace,
                    className: "animate-fadeIn",
                  };
                  setNodes((nds) => nds.concat(newNode as GridFlowNode));

                  setTimeout(() => {
                    setNodes((ns) =>
                      ns.map((n) => {
                        if (n.id === newNodeId) {
                          return { ...n, className: "" };
                        }
                        return n;
                      })
                    );
                  }, 300);
                }
              }}
              className="w-38 h-18 bg-primary rounded-xl flex flex-col items-center relative overflow-hidden border-[1px] border-secondary"
            >
              <div className="text-xs font-medium mt-2 w-full absolute top-0 left-0 pb-1.5 px-4 text-white flex items-center gap-1">
                <div className="tracking-widest text-[10px] text-[#d4d4d4]">
                  Folder
                </div>
              </div>
              <div className="flex relative mt-8 gap-1">
                <div className="h-8 w-8 rounded-full bg-secondary relative">
                  <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary relative">
                  <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary relative">
                  <DuckIcon className="h-7 w-7 text-primary absolute left-1/2 top-1/2 -translate-1/2" />
                </div>
              </div>
            </Tappable>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default memo(() => (
  <ReactFlowProvider>
    <Workspace />
  </ReactFlowProvider>
));
