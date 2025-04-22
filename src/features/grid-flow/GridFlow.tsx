import {
  ReactFlow,
  Background,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { initNodes, nodeTypes } from "./GridFlowNodes";
import { memo, useCallback, useEffect, useRef } from "react";
import DraggableAvatars from "./DraggableAvatars";
import { useDragStore } from "@/lib/store/dragStore";
import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import { usePinDeskStore } from "./PinDeskStore";

const NODE_SIZE = 40;

export const useGridFlowNodesState = (initNodes?: FlowNode[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes || []);

  return { nodes, setNodes, onNodesChange };
};

function GridFlow() {
  //@ts-ignore
  const { nodes, setNodes, onNodesChange } = useGridFlowNodesState(initNodes);
  const { getIntersectingNodes, screenToFlowPosition } = useReactFlow();
  const { nodesDraggable } = usePinDeskStore();
  const reactFlowWrapper = useRef(null);

  const enableAnimation = useRef(false);
  const showShadows = useRef(false);

  const prevPosition = useRef<{ x: number; y: number }>();

  const onNodeDragStart = useCallback((_: React.MouseEvent, node: FlowNode) => {
    prevPosition.current = node.position;

    const newNode = {
      id: "shadow",
      type: "shadow",
      position: prevPosition.current,
    };

    setNodes((nds) => nds.concat(newNode as FlowNode));
  }, []);

  const onNodeDrag = useCallback((_event: React.MouseEvent, node: FlowNode) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );

    if (intersections.filter((id) => id !== "shadow").length > 0) {
      showShadows.current = true;
    } else {
      showShadows.current = false;
    }
  }, []);

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      enableAnimation.current = true;
      setTimeout(() => {
        enableAnimation.current = false;
      }, 200);
      showShadows.current = false;

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

      setNodes((ns) =>
        ns
          .filter((ns) => ns.id !== "shadow")
          .map((n) => ({
            ...n,
            className: "",
          }))
      );
    },
    []
  );

  const nodesRef = useRef<FlowNode[]>([]);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    const handleOnTouchMove = (e: TouchEvent) => {
      // drag new item
      const draggableItem = useDragStore.getState().draggableItem;
      if (!draggableItem || !nodesRef.current) return;

      const touch = e.touches[0];
      const position = screenToFlowPosition({
        x: touch.clientX - NODE_SIZE,
        y: touch.clientY - NODE_SIZE,
      });

      const existingNode = nodes.find((n) => n.id === draggableItem.id);

      if (!existingNode) {
        const newNode = {
          id: draggableItem.id,
          type: draggableItem.type,
          position,
        };

        setNodes((nds) => nds.concat(newNode as FlowNode));
      } else {
        const intersections = getIntersectingNodes(existingNode).map(
          (n) => n.id
        );

        setNodes((ns) =>
          ns.map((n) => ({
            ...n,
            className: intersections.includes(n.id) ? "highlight" : "",
          }))
        );
      }
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
          className={`flow-wrapper ${showShadows.current && "shadow-visible"} ${enableAnimation.current && "transitions-enabled"}`}
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
          nodesDraggable={nodesDraggable}
          onNodeDrag={onNodeDrag}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
        >
          <Background bgColor="#191919" gap={40} />
        </ReactFlow>
        <div className="absolute bottom-0 left-0">
          <DraggableAvatars />
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/display-name
export default memo(() => (
  <ReactFlowProvider>
    <GridFlow />
  </ReactFlowProvider>
));

const getExtent = (val: number): number => {
  return Math.floor(val / 40) * 40;
};

const fixNodePosition = (
  node: FlowNode,
  setNodes: (updater: (prev: FlowNode[]) => FlowNode[]) => void,
  position?: { x: number; y: number }
) => {
  const rawPos = position ? position : { ...node.position };

  const snappedPos = {
    x: Math.round(rawPos.x / 20) * 20,
    y: Math.round(rawPos.y / 20) * 20,
  };

  // avoid zero positioning
  if (snappedPos.x === 0) snappedPos.x = 20;
  if (snappedPos.y === 0) snappedPos.y = 20;

  if (snappedPos.x !== node.position.x || snappedPos.y !== node.position.y) {
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, position: snappedPos } : n))
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
