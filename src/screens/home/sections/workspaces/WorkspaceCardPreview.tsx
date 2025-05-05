import {
  GridFlowNode,
  GridFlowNodeTypes,
} from "@/features/grid-flow/GridFlowInterface";
import { ReactFlowProvider, ReactFlow, Background } from "@xyflow/react";
import { memo } from "react";

// eslint-disable-next-line react/display-name
export const PreviewGridFlow = memo(
  ({
    nodes,
    className,
    id,
  }: {
    nodes: GridFlowNode[];
    className?: string;
    id: string;
  }) => {
    return (
      <ReactFlowProvider>
        <div style={{ width: "400px", height: "300px" }} className={className}>
          <ReactFlow
            id={id}
            nodes={nodes}
            nodeTypes={GridFlowNodeTypes}
            zoomOnDoubleClick={false}
            zoomOnPinch={false}
            zoomOnScroll={false}
            nodesDraggable={false}
            panOnDrag={false}
            fitView={false}
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
