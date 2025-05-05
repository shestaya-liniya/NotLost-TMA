import { memo, useEffect } from "react";
import GridFlow from "../../features/grid-flow/GridFlow";

import { useWorkspaceStore } from "./.store/Workspace.store";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { NodeChange, ReactFlowProvider, useNodesState } from "@xyflow/react";
import { jazzChatsToGridNodes } from "@/lib/jazz/actions/jazzWorkspace";
import WorkspacePinModal from "./modals/pin/WorkspacePinModal";
import WorkspaceTop from "./top/WorkspaceTop";
import { GridFlowNode } from "@/features/grid-flow/GridFlowInterface";
import { JazzListOfWorkspaceChats, JazzWorkspaceChat } from "@/lib/jazz/schema";

function Workspace() {
  const { activeWorkspace, unpinModeEnabled } = useWorkspaceStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    jazzChatsToGridNodes(activeWorkspace?.chats || [])
  );

  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) => {
        return {
          ...n,
          data: {
            ...n.data,
            deleteMode: unpinModeEnabled,
          },
        };
      })
    );
  }, [unpinModeEnabled]);

  const handleOnNodesChange = (change: NodeChange<GridFlowNode>[]) => {
    onNodesChange(change);
    if (change[0].type !== "position") {
      if (activeWorkspace?.chats) {
        saveNodesState(nodes);
      }
    }
  };

  const saveNodesState = (nodes: GridFlowNode[]) => {
    if (activeWorkspace?.chats) {
      activeWorkspace.chats = JazzListOfWorkspaceChats.create(
        nodes
          .filter((n) => n.type !== "shadow")
          .map((n) =>
            JazzWorkspaceChat.create({
              type: "chat",
              data: n.data,
              position: n.position,
            })
          )
      );
    }
  };

  return (
    <div className="h-screen relative">
      <WorkspaceTop />
      <div
        className="relative w-screen"
        style={{
          top: getMiniAppTopInset(),
        }}
      >
        <GridFlow
          id={"fullscreen"}
          nodes={nodes}
          setNodes={setNodes}
          onNodesChange={handleOnNodesChange}
          onNodeDragStop={saveNodesState}
        />
      </div>
      <WorkspacePinModal nodes={nodes} setNodes={setNodes} />
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default memo(() => (
  <ReactFlowProvider>
    <Workspace />
  </ReactFlowProvider>
));
