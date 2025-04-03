import { useEffect, useMemo, memo, useCallback } from "react";
import ForceGraph2D, { NodeObject } from "react-force-graph-2d";
import { JazzListOfFolders } from "@/lib/jazz/schema";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import { IGraphNode } from "./Graph.interface";
import { useNodeImageCache } from "./hooks/use-node-image-cache";
import GraphSelectedDialog from "./components/GraphSelectedDialog";
import GraphSettings from "./components/GraphSettings";
import { GraphFolderFlags } from "./components/GraphFoldersFlag";
import { AnimatePresence } from "framer-motion";
import graphSelectDialog from "./helpers/graph-select-dialog";
import graphDrawNode from "./helpers/nodes/graph-draw-node";
import { useGraphStore } from "./GraphStore";
import { graphFoldersInit } from "./helpers/graph-folder-init";

const Graph = ({ data }: { data: JazzListOfFolders }) => {
  const graphData = useMemo(() => graphFoldersInit(data), [data]);

  const {
    graphRef,
    selectedDialog,
    setSelectedDialog,
    graphCooldownTicks,
    graphWarmupTicks,
    graphDragMode,
    showFolderFlags,
    folderFlags,
  } = useGraphStore();

  const { imageCache, fetchImages } = useNodeImageCache(graphData.nodes);

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  useEffect(() => {
    graphRef?.current?.d3Force("charge")!.distanceMax(80);
    graphRef?.current?.centerAt(0, 0);
    graphRef?.current?.zoom(5);
    graphRef?.current?.d3Force("center", null);

    graphRef?.current?.d3Force("link")!.distance(() => {
      return 20;
    });
  }, []);

  const selectDialog = useCallback((node: NodeObject) => {
    graphSelectDialog(node as IGraphNode, selectedDialog, setSelectedDialog);
  }, []);

  return (
    <div>
      <AnimatePresence>
        {selectedDialog && <GraphSelectedDialog dialog={selectedDialog} />}
        {showFolderFlags && <GraphFolderFlags folderFlags={folderFlags} />}
      </AnimatePresence>

      <GraphSettings />

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        height={Number(getCssVariable("--initial-height").replace("px", ""))}
        enableNodeDrag={graphDragMode}
        cooldownTicks={graphCooldownTicks}
        warmupTicks={graphWarmupTicks}
        onBackgroundClick={() => setSelectedDialog(null)}
        onNodeClick={selectDialog}
        onNodeDrag={selectDialog}
        nodeCanvasObject={(node, ctx, globalScale) =>
          graphDrawNode(
            imageCache,
            graphRef,
            node as IGraphNode,
            ctx,
            globalScale
          )
        }
        nodePointerAreaPaint={(node, color, ctx) => {
          // clickable node zone, make little bit bigger
          const nodeSize = 15;

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkCanvasObject={(link, ctx) => {
          ctx.strokeStyle = hexToRgba(getCssVariable("--color-link"), 0.1);
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

export default memo(Graph);
