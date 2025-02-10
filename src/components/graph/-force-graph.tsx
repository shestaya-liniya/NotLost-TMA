import React, { useEffect, useState, useCallback, useMemo } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";
import { GraphData, GraphLink, GraphNode, GraphNodeType } from "./-@interface";
import { drawContactNode } from "./(nodes)/-draw-contact-node";
import { drawTopicNode, getTopicRadius } from "./(nodes)/-draw-topic-node";
import { useImageCache } from "./(nodes)/-use-image-cache";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { SelectedContact } from "./-selected-contact";
import { AnimatePresence } from "framer-motion";
import { JazzFolder, JazzListOfFolders } from "@/lib/jazz/schema";
import { getCssVariable } from "@/helpers/css/get-css-variable";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
  const [selectedContact, setSelectedContact] = useState<null | GraphNode>(
    null
  );
  const [selectedContactTimestamp, setSelectedContactTimestamp] = useState<
    null | number
  >(null);

  const lp = useLaunchParams();

  const graphData = useMemo(() => initializeGraphData(data), [data]);

  const { imageCache, fetchImages } = useImageCache(graphData.nodes);

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!];
      setGlobalScale(globalScale);

      switch (node.type) {
        case GraphNodeType.DIALOG:
          drawContactNode(node, ctx, globalScale, img);
          break;
        case GraphNodeType.TOPIC:
          drawTopicNode(node, ctx, globalScale, img, lp.platform);
          break;
      }
    },
    [imageCache]
  );

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }, {}> | undefined
  >(undefined);

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(50);
    fgRef?.current?.centerAt(0, 0);
    fgRef?.current?.zoom(1);
  }, []);

  const [globalScale, setGlobalScale] = useState<number | null>(null);

  return (
    <div>
      <div
        style={{
          top: `calc(${getCssVariable("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariable("--tg-viewport-content-safe-area-inset-top")})`,
        }}
        className="absolute left-0 z-10 w-full"
      >
        <AnimatePresence>
          {selectedContact && (
            <SelectedContact selectedContact={selectedContact} />
          )}
        </AnimatePresence>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        height={window.innerHeight}
        nodeAutoColorBy="group"
        onBackgroundClick={() => {
          setSelectedContact(null);
        }}
        onNodeClick={(node) => {
          /* fgRef?.current?.zoomToFit(
            500,
            // PADDING DEPENDS ON USER SCREEN RESOLUTION (small screens -> zoom more far a way; big screens -> zoom closer)
            175,
            (filterNode) => filterNode.id === node.id
          ); */

          if (selectedContact !== node) {
            setSelectedContactTimestamp(Date.now());
            setSelectedContact(null);
            setTimeout(() => {
              setSelectedContact(node as GraphNode);
            }, 150);
          } else if (
            selectedContactTimestamp &&
            selectedContact.type === GraphNodeType.DIALOG &&
            Date.now() - selectedContactTimestamp < 500
          ) {
            window.open(`https://t.me/${selectedContact.username}`);
          }
          setSelectedContactTimestamp(Date.now());
        }}
        onNodeDrag={(node) => {
          if (selectedContact !== node) {
            setSelectedContact(null);
            setTimeout(() => {
              setSelectedContact(node as GraphNode);
            }, 150);
          }
        }}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={(node, color, ctx) => {
          // clickable node zone
          let imgSize;
          if (node.type === GraphNodeType.TOPIC) {
            imgSize = getTopicRadius(globalScale ? globalScale : 0);
          } else {
            imgSize = 20;
          }
          console.log();
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkCanvasObject={(link, ctx) => {
          ctx.strokeStyle = getCssVariable("--tg-theme-button-color");
          ctx.lineWidth = 0.5;

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

const initializeGraphData = (folders: JazzListOfFolders): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  function processFolders(
    folders: JazzFolder[],
    nodes: GraphNode[],
    links: GraphLink[]
  ) {
    folders.forEach((folder) => {
      if (!folder) return;

      nodes.push({
        id: folder.id,
        title: folder.title,
        targets: [],
        type: GraphNodeType.TOPIC,
      });

      folder?.dialogs?.forEach((dialog) => {
        if (!dialog) return;

        nodes.push({
          id: dialog.id,
          username: dialog.username,
          firstName: dialog.name,
          tags: [],
          type: GraphNodeType.DIALOG,
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

export default ForceGraph;
