import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";
import {
  IGraphNode,
  IGraphNodeDialog,
  IGraphNodeType,
} from "./Graph.interface";
import { drawContactNode } from "./helpers/graphDrawDialog";
import { drawTopicNode } from "./helpers/graphDrawFolder";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { GraphSelectedDialog } from "./GraphSelectedDialog";
import { AnimatePresence } from "framer-motion";
import { JazzListOfFolders } from "@/lib/jazz/schema";
import Switch from "@/ui/Switch";
import { getCssVariable } from "@/helpers/css/getCssVariable";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import graphSelectDialog from "./helpers/graphSelectDialog";
import { useNodeImageCache } from "./helpers/useNodeImageCache";
import graphInitNodes from "./helpers/graphInitNodes";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
  const [selectedDialog, setSelectedDialog] = useState<null | IGraphNodeDialog>(
    null
  );

  const lp = retrieveLaunchParams();

  const graphData = useMemo(() => graphInitNodes(data), [data]);

  const [dragNodes, setDragNodes] = useState<boolean>(false);

  const { imageCache, fetchImages } = useNodeImageCache(graphData.nodes);

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  const isMacOrIos = ["macos", "ios"].includes(lp.tgWebAppPlatform);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!];

      switch (node.type) {
        case IGraphNodeType.DIALOG:
          drawContactNode(node, ctx, globalScale, img, isMacOrIos);
          break;
        case IGraphNodeType.FOLDER:
          drawTopicNode(node, ctx, img, isMacOrIos);
          break;
      }
    },
    [imageCache]
  );

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }> | undefined
  >(undefined);

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(140);
    fgRef?.current?.centerAt(0, 0);
    fgRef?.current?.zoom(5);
    fgRef?.current?.d3Force("link")!.distance(() => {
      return 20;
    });
  }, []);

  const selectDialog = useCallback((node: NodeObject) => {
    graphSelectDialog(node as IGraphNode, selectedDialog, setSelectedDialog);
  }, []);

  return (
    <div
      style={{
        height: `calc(var(--initial-height)`,
      }}
    >
      <div
        style={{
          top: `calc(${getCssVariable("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariable("--tg-viewport-content-safe-area-inset-top")})`,
        }}
        className="absolute left-0 z-10 w-full"
      >
        <AnimatePresence>
          {selectedDialog && (
            <GraphSelectedDialog selectedDialog={selectedDialog} />
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-6 z-10 backdrop-blur-sm px-4 pt-2 pb-1 rounded-2xl border-2 border-primary/30">
        <Switch
          label="Drag mode"
          checked={dragNodes}
          onChange={(checked) => setDragNodes(checked)}
        />
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        height={Number(getCssVariable("--initial-height").replace("px", ""))}
        nodeAutoColorBy="group"
        enableNodeDrag={dragNodes}
        onBackgroundClick={() => {
          setSelectedDialog(null);
        }}
        onNodeClick={selectDialog}
        onNodeDrag={selectDialog}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          const nodeSize = 15; // clickable node zone, make little bit bigger

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkCanvasObject={(link, ctx) => {
          ctx.strokeStyle = hexToRgba(getCssVariable("--color-link"), 0.5);
          ctx.lineWidth = 0.25;

          ctx.beginPath();
          ctx.moveTo(
            (link.source as { x: number; y: number }).x,
            (link.source as { x: number; y: number }).y
          );
          ctx.lineTo(
            (link.target as { x: number; y: number }).x,
            (link.target as { x: number; y: number }).y
          );
          ctx.stroke();
        }}
      />
    </div>
  );
};

export default memo(ForceGraph);
