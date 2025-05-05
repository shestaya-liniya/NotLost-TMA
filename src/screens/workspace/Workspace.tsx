import { memo, useEffect } from "react";
import GridFlow from "../../features/grid-flow/GridFlow";

import { useWorkspaceStore } from "./.store/Workspace.store";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { ReactFlowProvider, useNodesState } from "@xyflow/react";
import { jazzChatsToGridNodes } from "@/lib/jazz/actions/jazzWorkspace";
import WorkspacePinModal from "./modals/pin/WorkspacePinModal";
import WorkspaceTop from "./top/WorkspaceTop";

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
          onNodesChange={onNodesChange}
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
