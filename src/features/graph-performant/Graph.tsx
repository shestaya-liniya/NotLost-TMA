import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";
import {
  IGraphData,
  IGraphLink,
  IGraphNode,
  IGraphNodeDialog,
  IGraphNodeType,
} from "./Graph.interface";
import { drawContactNode } from "./helpers/-draw-contact-node";
import { drawTopicNode, getTopicRadius } from "./helpers/-draw-topic-node";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { GraphSelectedDialog } from "./GraphSelectedDialog";
import { AnimatePresence } from "framer-motion";
import { JazzFolder, JazzListOfFolders } from "@/lib/jazz/schema";
import Switch from "@/ui/Switch";
import { getCssVariable } from "@/helpers/css/getCssVariable";
import { getElementHeightById } from "@/helpers/css/getElementHeight";
import { hexToRgba } from "@/helpers/css/hexToRgba";
import graphSelectDialog from "./helpers/graphSelectDialog";
import { useNodeImageCache } from "./helpers/useNodeImageCache";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
  const [selectedDialog, setSelectedDialog] = useState<null | IGraphNodeDialog>(
    null
  );

  const lp = retrieveLaunchParams();

  const graphData = useMemo(() => initializeGraphData(data), [data]);

  const [dragNodes, setDragNodes] = useState<boolean>(false);

  const { imageCache, fetchImages } = useNodeImageCache(graphData.nodes);

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!];
      setGlobalScale(globalScale);

      switch (node.type) {
        case IGraphNodeType.DIALOG:
          drawContactNode(
            node,
            ctx,
            globalScale,
            img,
            lp.tgWebAppPlatform === "ios"
          );
          break;
        case IGraphNodeType.FOLDER:
          drawTopicNode(node, ctx, img, lp.tgWebAppPlatform);
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

  const [globalScale, setGlobalScale] = useState<number | null>(null);

  const tabBarHeight = getElementHeightById("tab-bar");

  return (
    <div
      style={{
        height: `calc(var(--initial-height) - ${tabBarHeight}px)`,
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
        height={
          Number(getCssVariable("--initial-height").replace("px", "")) -
          tabBarHeight!
        }
        nodeAutoColorBy="group"
        enableNodeDrag={dragNodes}
        onBackgroundClick={() => {
          setSelectedDialog(null);
        }}
        onNodeClick={(node) => {
          graphSelectDialog(
            node as IGraphNode,
            selectedDialog,
            setSelectedDialog
          );
        }}
        onNodeDrag={(node) => {
          graphSelectDialog(
            node as IGraphNode,
            selectedDialog,
            setSelectedDialog
          );
        }}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          // clickable node zone
          let imgSize;
          if (node.type === IGraphNodeType.FOLDER) {
            imgSize = getTopicRadius(globalScale ? globalScale : 0);
          } else {
            imgSize = 15;
          }
          console.log();
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false);
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

const initializeGraphData = (folders: JazzListOfFolders): IGraphData => {
  const nodes: IGraphNode[] = [];
  const links: IGraphLink[] = [];

  function processFolders(
    folders: JazzFolder[],
    nodes: IGraphNode[],
    links: IGraphLink[]
  ) {
    folders.forEach((folder) => {
      if (!folder) return;

      nodes.push({
        id: folder.id,
        title: folder.title,
        targets: [],
        type: IGraphNodeType.FOLDER,
      });

      folder?.dialogs?.forEach((dialog) => {
        if (!dialog) return;

        nodes.push({
          id: dialog.id,
          username: dialog.username,
          firstName: dialog.name,
          tags: [],
          type: IGraphNodeType.DIALOG,
        });

        links.push({
          source: folder.id,
          target: dialog.id,
        });
      });

      if (folder.nestedFolders?.length) {
        processFolders(folder.nestedFolders as JazzFolder[], nodes, links);

        folder.nestedFolders.forEach((subFolder) => {
          if (!subFolder) return;
          links.push({
            source: folder.id,
            target: subFolder.id,
          });
        });
      }
    });
  }

  processFolders(folders as JazzFolder[], nodes, links);
  return { nodes, links };
};

export default memo(ForceGraph);
