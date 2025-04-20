import {
  ReactFlow,
  Background,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { initNodes, nodeTypes } from "./GridFlowNodes";
import { useCallback, useRef } from "react";
import { DnDProvider } from "./DnDProvider";
import DraggableAvatars from "./DraggableAvatars";

let id = 0;
export const getId = () => `dndnode_${id++}`;

export const useGridFlowNodesState = (initNodes?: FlowNode[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes || []);

  return { nodes, setNodes, onNodesChange };
};

function GridFlow() {
  const { nodes, setNodes, onNodesChange } = useGridFlowNodesState(initNodes);
  const { getIntersectingNodes } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  const prevPosition = useRef<{ x: number; y: number }>();

  const onNodeDrag = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    fixNodePosition(node, setNodes);
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    if (intersections.length > 0 && prevPosition.current) {
      setNodes((prev) => [
        ...prev,
        {
          ...node,
          position: prevPosition.current as { x: number; y: number },
        },
      ]);
      node.position = prevPosition.current;
    }
    prevPosition.current = node.position;
  }, []);

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      fixNodePosition(node, setNodes);
      const intersections = getIntersectingNodes(node).map((n) => n.id);
      if (intersections.length > 0 && prevPosition.current) {
        setNodes((prev) => [
          ...prev,
          {
            ...node,
            position: prevPosition.current as { x: number; y: number },
          },
        ]);
        node.position = prevPosition.current;
      }
      prevPosition.current = node.position;
    },
    []
  );

  return (
    <div className="relative transition-all duration-300 ease-in-out">
      <div ref={reactFlowWrapper} className="h-screen w-screen">
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          snapToGrid
          snapGrid={[20, 20]}
          translateExtent={[
            [0, 0],
            [getExtent(window.innerWidth), getExtent(window.innerHeight)],
          ]}
          nodeExtent={[
            [0, 0],
            [
              getExtent(window.innerWidth) - 28,
              getExtent(window.innerHeight) - 28,
            ],
          ]}
          zoomOnDoubleClick={false}
          zoomOnPinch={false}
          zoomOnScroll={false}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
        >
          <Background bgColor="#191919" gap={40} />
        </ReactFlow>
      </div>
      <div className="absolute bottom-0 left-0">
        <DraggableAvatars />
      </div>
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <GridFlow />
    </DnDProvider>
  </ReactFlowProvider>
);

const getExtent = (val: number): number => {
  return Math.floor(val / 40) * 40;
};

const fixNodePosition = (
  node: FlowNode,
  setNodes: (updater: (prev: FlowNode[]) => FlowNode[]) => void
) => {
  const newPos = { ...node.position };

  if (newPos.x === 0) newPos.x = 20;
  if (newPos.y === 0) newPos.y = 20;

  if (newPos.x !== node.position.x || newPos.y !== node.position.y) {
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, position: newPos } : n))
    );
  }
};

interface FlowNode {
  id: string;
  type: string;
  data: {
    name: string;
    job: string;
    emoji: string;
  };
  position: {
    x: number;
    y: number;
  };
}
