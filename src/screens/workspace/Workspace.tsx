import { memo, useEffect } from "react";
import GridFlow from "../../features/grid-flow/GridFlow";

import { useWorkspaceStore } from "./.store/Workspace.store";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { NodeChange, ReactFlowProvider, useNodesState } from "@xyflow/react";
import WorkspacePinModal from "./modals/pin/WorkspacePinModal";
import WorkspaceTop from "./top/WorkspaceTop";
import { GridFlowNode } from "@/features/grid-flow/GridFlowInterface";
import {
  JazzListOfWorkspaceChats,
  JazzListOfWorkspaceFolderChats,
  JazzListOfWorkspaceFolders,
  JazzWorkspaceChat,
  JazzWorkspaceFolder,
} from "@/lib/jazz/schema";
import { jazzNodesToGridNodes } from "@/lib/jazz/actions/jazzWorkspace";

function Workspace() {
  const { activeWorkspace, unpinModeEnabled } = useWorkspaceStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    jazzNodesToGridNodes([
      ...(activeWorkspace?.chats || []),
      ...(activeWorkspace?.folders || []),
    ])
  );

  useEffect(() => {
    setNodes((ns) =>
      ns.map((n) => {
        if (n.type === "chat") {
          return {
            ...n,
            data: {
              ...n.data,
              deleteMode: unpinModeEnabled,
            },
          };
        } else if (n.type === "folder") {
          return {
            ...n,
            data: {
              ...n.data,
              deleteMode: unpinModeEnabled,
            },
          };
        }
        return n;
      })
    );
  }, [unpinModeEnabled]);

  const handleOnNodesChange = (change: NodeChange<GridFlowNode>[]) => {
    onNodesChange(change);
    if (change[0].type !== "position") {
      if (activeWorkspace?.chats) {
        saveNodesState(nodes);
      }
      if (activeWorkspace?.folders) {
        saveNodesState(nodes);
      }
    }
  };

  const saveNodesState = (nodes: GridFlowNode[]) => {
    if (activeWorkspace?.chats) {
      activeWorkspace.chats = JazzListOfWorkspaceChats.create(
        nodes
          .filter((n) => n.type === "chat")
          .map((n) =>
            JazzWorkspaceChat.create({
              type: n.type,
              data: n.data,
              position: n.position,
            })
          )
      );
    }

    if (activeWorkspace?.folders) {
      activeWorkspace.folders = JazzListOfWorkspaceFolders.create(
        nodes
          .filter((n) => n.type === "folder")
          .map((n) => {
            const existantFolder = activeWorkspace.folders?.find(
              (f) => f?.data.title === n.data.title
            );
            return JazzWorkspaceFolder.create({
              type: "folder",
              data: n.data,
              chats:
                existantFolder?.chats ||
                JazzListOfWorkspaceFolderChats.create([]),
              position: n.position,
            });
          })
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
