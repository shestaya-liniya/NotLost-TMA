import { useEffect, useMemo, memo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { JazzFolder, JazzListOfFolders } from "@/lib/jazz/schema";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import {
  IGraphData,
  IGraphLink,
  IGraphNode,
  IGraphNodeType,
} from "./Graph.interface";
import { useNodeImageCache } from "./hooks/useNodeImageCache";
import GraphSelectedDialog from "./components/GraphSelectedDialog";
import GraphSettings from "./components/GraphSettings";
import { GraphFolderFlags } from "./components/GraphFoldersFlag";
import { AnimatePresence } from "framer-motion";
import graphSelectDialog from "./helpers/graphSelectDialog";
import graphDrawNode from "./nodes/graphDrawNode";
import { useGraphStore } from "./GraphStore";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
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

  const graphData = useMemo(() => initializeGraphData(data), [data]);

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
        nodeCanvasObject={(node, ctx, globalScale) =>
          graphDrawNode(imageCache, graphRef, node, ctx, globalScale)
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

const initializeGraphData = (folders: JazzListOfFolders): IGraphData => {
  const nodes: IGraphNode[] = [];
  const links: IGraphLink[] = [];

  /* const centerNode = {
    id: "center",
    title: "My space",
    targets: [],
    type: GraphNodeType.TOPIC,
  }; */

  //nodes.push(centerNode as GraphNode);

  function processFolders(
    folders: JazzFolder[],
    nodes: IGraphNode[],
    links: IGraphLink[],
    nested: boolean
  ) {
    folders.forEach((folder) => {
      if (!folder) return;

      if (nested) {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: IGraphNodeType.FOLDER,
          nested: true,
        });
      } else {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: IGraphNodeType.FOLDER,
        });
      }

      /* if (!nested) {
        links.push({
          source: folder.id,
          target: "center",
        });
      } */

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
        processFolders(
          folder.nestedFolders as JazzFolder[],
          nodes,
          links,
          true
        );

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

  processFolders(folders as JazzFolder[], nodes, links, false);
  return { nodes, links };
};

export default memo(ForceGraph);
