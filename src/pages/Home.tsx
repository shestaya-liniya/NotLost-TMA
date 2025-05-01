import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { MiniAppTopButton } from "@/ui/MiniAppTopButton";
import MenuIcon from "@/assets/icons/telegram.svg?react";
import { memo, useState } from "react";
import MiniAppTopMenu, {
  MiniAppTopMenuDivider,
  MiniAppTopMenuItem,
} from "@/ui/MiniAppTopMenu";
import CrownIcon from "@/assets/icons/crown.svg?react";
import GraphIcon from "@/assets/icons/graph-icon.svg?react";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import HorizontalScrollableList from "@/ui/VerticalScrollableList";
import Tappable from "@/ui/Tappable";
import { useModalStore } from "@/lib/store/modalStore";
import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import {
  initNodes,
  GridFlowNodeTypes,
} from "@/features/grid-flow/nodes/GridFlowNodes";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const { setWorkspaceOpen: setPinDeskOpen } = useModalStore();
  return (
    <div className="h-screen relative">
      <MiniAppTopButton onClick={() => setShowMenu(true)}>
        <MenuIcon
          className={`h-4 w-4 text-white transition-transform duration-300`}
        />
        NotLost
      </MiniAppTopButton>
      <MiniAppTopMenu show={showMenu} setShow={setShowMenu}>
        <MiniAppTopMenuItem>
          <div>Premium</div>
          <CrownIcon className="h-4 w-4" />
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <div>Graph</div>
          <GraphIcon className="h-4 w-4 scale-130" />
        </MiniAppTopMenuItem>
        <MiniAppTopMenuDivider />
        <MiniAppTopMenuItem>
          <div>Settings</div>
          <SettingsIcon className="h-4 w-4" />
        </MiniAppTopMenuItem>
      </MiniAppTopMenu>
      <div
        style={{
          paddingTop: getMiniAppTopInset() + 20,
        }}
        className="px-4"
      >
        <div>
          <Tappable
            onTap={() => setPinDeskOpen(true)}
            className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2"
          >
            <div className="text-xs">All workspaces</div>
            <ChevronRightIcon className="h-2 w-2 mt-0.5" />
          </Tappable>
          <HorizontalScrollableList className="-ml-4 -mr-4 px-4 pt-3">
            <li>
              <Tappable
                onClick={() => setPinDeskOpen(true)}
                className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
              >
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <PreviewGridFlow id="preview" />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </Tappable>
            </li>
            <li>
              <Tappable
                onClick={() => setPinDeskOpen(true)}
                className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
              >
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <PreviewGridFlow id="preview" />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </Tappable>
            </li>
            <li>
              <Tappable
                onClick={() => setPinDeskOpen(true)}
                className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
              >
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <PreviewGridFlow id="preview" />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </Tappable>
            </li>
            <li>
              <Tappable
                onClick={() => setPinDeskOpen(true)}
                className="w-40 h-30 rounded-2xl relative overflow-hidden border-[1px] border-secondary"
              >
                <div className="absolute -top-10 -left-30 w-100 h-30 scale-30 pointer-events-none">
                  <PreviewGridFlow id="preview" />
                </div>

                <div className="absolute bottom-0 w-full h-10 bg-secondary flex items-center pl-2">
                  <div className="text-xs font-medium text-hint">
                    Workspace #1
                  </div>
                </div>
              </Tappable>
            </li>
          </HorizontalScrollableList>
        </div>
        <div>
          <div className="text-[#D4D4D4] font-medium flex gap-1 items-center ml-2 mt-4">
            <div className="text-xs">Inbox</div>
            <ChevronRightIcon className="h-2 w-2 mt-0.5" />
            <div className="rounded-full text-xs p-0.5 h-4 w-4 bg-red-500/80 grid place-content-center">
              0
            </div>
            <div className="rounded-full text-xs p-0.5 h-4 w-4 bg-secondary grid place-content-center">
              0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/display-name
const PreviewGridFlow = memo(
  ({ className, id }: { className?: string; id: string }) => {
    return (
      <ReactFlowProvider>
        <div style={{ width: "400px", height: "300px" }} className={className}>
          <ReactFlow
            id={id}
            nodes={initNodes}
            nodeTypes={GridFlowNodeTypes}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
            nodesDraggable={false}
            panOnDrag={false}
            fitView
            preventScrolling={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background bgColor="#191919" gap={40} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    );
  }
);
