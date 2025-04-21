import {
  ReactFlow,
  Background,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { initNodes, nodeTypes } from "./GridFlowNodes";
import { useCallback, useEffect, useRef, useState } from "react";
import DraggableAvatars from "./DraggableAvatars";
import { useDragStore } from "@/lib/store/dragStore";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import Tappable from "@/ui/Tappable";
import GridFlowMenu from "./GridFlowMenu";

const NODE_SIZE = 40;

export const useGridFlowNodesState = (initNodes?: FlowNode[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes || []);

  return { nodes, setNodes, onNodesChange };
};

function GridFlow() {
  //@ts-ignorec
  const { nodes, setNodes, onNodesChange } = useGridFlowNodesState(initNodes);
  const { getIntersectingNodes, screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef(null);

  const [showMenu, setShowMenu] = useState(false);

  const prevPosition = useRef<{ x: number; y: number }>();
  const lastValidPositionRef = useRef<{ x: number; y: number }>();

  const onNodeDrag = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    _event.preventDefault();
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

  const nodesRef = useRef<FlowNode[]>([]);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    const handleOnTouchMove = (e: TouchEvent) => {
      const draggableItem = useDragStore.getState().draggableItem;
      if (!draggableItem || !nodesRef.current) return;

      const touch = e.touches[0];
      const position = screenToFlowPosition({
        x: touch.clientX - NODE_SIZE,
        y: touch.clientY - NODE_SIZE,
      });
      //@ts-ignore
      setNodes((prev) => {
        const existingNode = prev.find((n) => n.id === draggableItem.id);

        if (existingNode) {
          const nextPosition = { ...position };
          const updatedNode = { ...existingNode, position: nextPosition };

          const intersections = getIntersectingNodes(updatedNode).map(
            (n) => n.id
          );

          if (intersections.length > 0 && prevPosition.current) {
            return prev;
          }

          prevPosition.current = nextPosition;
          lastValidPositionRef.current = nextPosition;

          return prev.map((n) =>
            n.id === draggableItem.id ? { ...n, position: nextPosition } : n
          );
        } else {
          const newNode = {
            id: draggableItem.id,
            type: draggableItem.type,
            position,
          };

          const wouldIntersect = prev.some((existingNode) => {
            return (
              position.x < existingNode.position.x + NODE_SIZE &&
              position.x + NODE_SIZE > existingNode.position.x &&
              position.y < existingNode.position.y + NODE_SIZE &&
              position.y + NODE_SIZE > existingNode.position.y
            );
          });

          if (wouldIntersect) {
            if (lastValidPositionRef.current) {
              newNode.position = lastValidPositionRef.current;
            } else {
              return prev;
            }
          }

          lastValidPositionRef.current = newNode.position;

          return [...prev, newNode];
        }
      });
    };

    window.addEventListener("touchmove", handleOnTouchMove);

    return () => {
      window.removeEventListener("touchmove", handleOnTouchMove);
    };
  }, []);

  return (
    <div className="relative transition-all duration-300 ease-in-out h-screen">
      <div
        ref={reactFlowWrapper}
        style={{
          height: window.innerHeight - getMiniAppTopInset(),
          marginTop: getMiniAppTopInset(),
          position: "relative",
        }}
      >
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          snapToGrid
          snapGrid={[20, 20]}
          translateExtent={[
            [0, 0],
            [
              getExtent(window.innerWidth),
              getExtent(window.innerHeight - getMiniAppTopInset()),
            ],
          ]}
          nodeExtent={[
            [0, 0],
            [
              getExtent(window.innerWidth) - 28,
              getExtent(window.innerHeight - getMiniAppTopInset()) - 28,
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
        <div className="absolute bottom-0 left-0">
          <DraggableAvatars />
        </div>
      </div>
      <Tappable
        onClick={() => setShowMenu(!showMenu)}
        style={{
          top: -getMiniAppTopInset() / 2,
        }}
        className="absolute left-1/2 text-sm max-h-[32px] h-[32px] -translate-x-1/2 backdrop-blur-[25px] bg-black/20 rounded-2xl px-3 py-1.5 font-medium flex items-center gap-2 border-[1px] border-[#252525]"
      >
        Workspace
        <SettingsIcon
          className={`h-4 w-4 text-white transition-transform duration-300 ${
            showMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </Tappable>
      <GridFlowMenu show={showMenu} setShow={setShowMenu} />
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default () => (
  <ReactFlowProvider>
    <GridFlow />
  </ReactFlowProvider>
);

const getExtent = (val: number): number => {
  return Math.floor(val / 40) * 40;
};

const fixNodePosition = (
  node: FlowNode,
  setNodes: (updater: (prev: FlowNode[]) => FlowNode[]) => void,
  position?: { x: number; y: number }
) => {
  const newPos = position ? position : { ...node.position };

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
