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
import { AnimatePresence } from "framer-motion";
import { JazzListOfFolders } from "@/lib/jazz/schema";
import { getCssVariable } from "@/helpers/css/getCssVariable";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import graphSelectDialog from "./helpers/graphSelectDialog";
import { useNodeImageCache } from "./helpers/useNodeImageCache";
import graphInitNodes from "./helpers/graphInitNodes";
import GraphSettings from "./components/GraphSettings";
import { GraphFolderFlags } from "./components/GraphFoldersFlag";
import GraphSelectedDialog from "./components/GraphSelectedDialog";
import graphUpdateFolderFlag from "./helpers/graphUpdateFolderFlag";
import { useGraphStore } from "./GraphStore";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
  const graphData = useMemo(() => graphInitNodes(data), [data]);
  const { imageCache, fetchImages } = useNodeImageCache(graphData.nodes);
  const { folderFlags } = useGraphStore();

  const graphRef = React.useRef<
    ForceGraphMethods<{ id: string | number }> | undefined
  >(undefined);

  const lp = retrieveLaunchParams();
  const isMacOrIos = ["macos", "ios"].includes(lp.tgWebAppPlatform);
  //const isIos = ["ios"].includes(lp.tgWebAppPlatform);

  // Graph State
  const [selectedDialog, setSelectedDialog] = useState<null | IGraphNodeDialog>(
    null
  );

  const [graphDragModeEnabled, setGraphDragModeEnabled] =
    useState<boolean>(false);
  const [showFolderFlags, setShowFolderFlags] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);

  const [graphCooldownTicks, setGraphCooldownTicks] = useState<
    number | undefined
  >(0);
  const [graphWarmupTicks, setGraphWarmupTicks] = useState<number | undefined>(
    30
  );

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!];

      switch (node.type) {
        case IGraphNodeType.DIALOG:
          drawContactNode(node, ctx, globalScale, img, isMacOrIos);
          break;
        case IGraphNodeType.FOLDER:
          drawTopicNode(node, ctx, img, isMacOrIos);
          if (showFolderFlags) {
            graphUpdateFolderFlag(graphRef, node);
          }

          break;
      }
    },
    [imageCache, showFolderFlags]
  );

  useEffect(() => {
    graphRef?.current?.d3Force("charge")!.distanceMax(140);
    graphRef?.current?.centerAt(0, 0);
    graphRef?.current?.zoom(5);
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
        {showFolderFlags && (
          <GraphFolderFlags folderFlags={folderFlags} graphRef={graphRef} />
        )}
      </AnimatePresence>

      <GraphSettings
        isSettingsModalOpen={isSettingsModalOpen}
        setIsSettingsModalOpen={(val) => setIsSettingsModalOpen(val)}
        graphDragModeEnabled={graphDragModeEnabled}
        setGraphDragMode={(val) => setGraphDragModeEnabled(val)}
        setGraphCooldownTicks={(val) => setGraphCooldownTicks(val)}
        setGraphWarmupTicks={(val) => setGraphWarmupTicks(val)}
        showFolderFlags={showFolderFlags}
        setShowFolderFlags={(val) => setShowFolderFlags(val)}
      />

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        height={Number(getCssVariable("--initial-height").replace("px", ""))}
        nodeAutoColorBy="group"
        enableNodeDrag={graphDragModeEnabled}
        cooldownTicks={graphCooldownTicks}
        warmupTicks={graphWarmupTicks}
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

export default memo(ForceGraph);
