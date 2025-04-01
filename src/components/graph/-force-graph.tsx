import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  NodeObject,
} from "react-force-graph-2d";
import { GraphData, GraphLink, GraphNode, GraphNodeType } from "./-@interface";
import { drawContactNode } from "./(nodes)/-draw-contact-node";
import { drawTopicNode, getTopicRadius } from "./(nodes)/-draw-topic-node";
import { useImageCache } from "./(nodes)/-use-image-cache";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { SelectedContact } from "./-selected-contact";
import { AnimatePresence } from "framer-motion";
import { JazzFolder, JazzListOfFolders } from "@/lib/jazz/schema";
import { getCssVariable } from "@/helpers/css/get-css-variable";
import { hexToRgba } from "@/helpers/css/hex-to-rgba";
import Switch from "@/ui/Switch";
import SettingsIcon from "@/assets/icons/settings-outline.svg?react";
import { createPortal } from "react-dom";
import BottomModal from "@/ui/modals/BottomModal";
import Tappable from "@/ui/Tappable";

const ForceGraph = ({ data }: { data: JazzListOfFolders }) => {
  const [selectedContact, setSelectedContact] = useState<null | GraphNode>(
    null
  );
  const [selectedContactTimestamp, setSelectedContactTimestamp] = useState<
    null | number
  >(null);

  const [topicFlags, setTopicFlags] = useState<
    {
      id: string;
      title: string;
      x: number;
      y: number;
      distance: number;
      visible: boolean;
    }[]
  >([]);
  const [cooldownTicks, setCooldownTicks] = useState<undefined | number>(0);
  const [warmupTicks, setWarmupTicks] = useState<undefined | number>(30);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const lp = retrieveLaunchParams();

  const graphData = useMemo(() => initializeGraphData(data), [data]);

  const [dragNodes, setDragNodes] = useState<boolean>(false);
  const [showFlags, setShowFlags] = useState(false);

  const { imageCache, fetchImages } = useImageCache(graphData.nodes);

  useEffect(() => {
    fetchImages();
  }, [graphData.nodes, imageCache]);

  const fgRef = React.useRef<
    ForceGraphMethods<{ id: string | number }, {}> | undefined
  >(undefined);

  const drawNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const img = imageCache[node.id!];
      setGlobalScale(globalScale);
      if (fgRef && node.type === "topic" && !node.nested) {
        const W = window.innerWidth - 20;
        const H =
          Number(getCssVariable("--initial-height").replace("px", "")) - 20;

        const nodeInfo = isNodeOnScreen(node, fgRef, H, W);
        if (nodeInfo) {
          const { x, y, isVisible } = nodeInfo;
          const position = clampPosition(
            x,
            y,
            W,
            H,
            -getTextWidth(node.title) - 10,
            -20
          );
          setTopicFlags((prev) => {
            const existingIndex = prev.findIndex((flag) => flag.id === node.id);

            if (existingIndex !== -1) {
              return prev.map((flag, index) =>
                index === existingIndex
                  ? {
                      ...flag,
                      id: String(node.id),
                      x: position.x,
                      y: position.y,
                      distance: position.distance,
                      visible: isVisible,
                    }
                  : flag
              );
            } else {
              return [
                ...prev,
                {
                  id: String(node.id),
                  title: node.title,
                  x: position.x,
                  y: position.y,
                  distance: position.distance,
                  visible: isVisible,
                },
              ];
            }
          });
        }
      }

      switch (node.type) {
        case GraphNodeType.DIALOG:
          drawContactNode(node, ctx, globalScale, img, lp.tgWebAppPlatform);
          break;
        case GraphNodeType.TOPIC:
          drawTopicNode(node, ctx, img, lp.tgWebAppPlatform);
          break;
      }
    },
    [imageCache]
  );

  useEffect(() => {
    fgRef?.current?.d3Force("charge")!.distanceMax(80);
    fgRef?.current?.centerAt(0, 0);
    fgRef?.current?.zoom(5);
    fgRef?.current?.d3Force("center", null);

    fgRef?.current?.d3Force("link")!.distance(() => {
      return 20;
    });
  }, []);

  const [globalScale, setGlobalScale] = useState<number | null>(null);

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
          {selectedContact && (
            <SelectedContact selectedContact={selectedContact} />
          )}
        </AnimatePresence>
      </div>

      <Tappable
        onClick={() => setShowSettingsModal(true)}
        className="bg-primary/50 absolute right-4 backdrop-blur-xl p-2 rounded-2xl z-50"
        style={{
          top: `calc(${getCssVariable("--tg-viewport-safe-area-inset-top") || "0px"} + ${getCssVariable("--tg-viewport-content-safe-area-inset-top")})`,
        }}
      >
        <SettingsIcon className="h-8 w-8 text-link  " />
      </Tappable>

      {showFlags &&
        topicFlags.map((flag) => {
          return (
            <Tappable
              onClick={() => {
                fgRef?.current?.zoomToFit(
                  500,
                  // PADDING DEPENDS ON USER SCREEN RESOLUTION (small screens -> zoom more far a way; big screens -> zoom closer)
                  175,
                  (filterNode) => filterNode.id === flag.id
                );
              }}
              key={flag.id}
              style={{
                top: flag.y,
                left: flag.x,
                opacity: flag.visible ? 0 : 1,
              }}
              className={`text-xs bg-link/20 text-link px-2 py-1 rounded-xl absolute z-40 backdrop-blur-lg whitespace-nowrap transition-opacity duration-300 ease-in-out flex items-center gap-1`}
            >
              {flag.title}
              <span className="text-hint">
                {Math.floor(flag.distance / 100)}
              </span>{" "}
            </Tappable>
          );
        })}

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        height={Number(getCssVariable("--initial-height").replace("px", ""))}
        nodeAutoColorBy="group"
        enableNodeDrag={dragNodes}
        cooldownTicks={cooldownTicks}
        warmupTicks={warmupTicks}
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
            imgSize = 15;
          }
          console.log();
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, imgSize / 2, 0, 2 * Math.PI, false);
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
      {createPortal(
        <BottomModal
          id=""
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="Graph settings"
        >
          <div className="grid grid-cols-2 pb-6">
            <div>
              <div className="font-medium">Drag mode</div>
              <div className="text-hint text-xs">
                Move graph with your fingers
              </div>
            </div>
            <div className="py-2 rounded-2xl flex justify-end">
              <Switch
                label=""
                checked={dragNodes}
                onChange={(checked) => {
                  if (checked) {
                    setCooldownTicks(undefined);
                    setWarmupTicks(undefined);
                  } else {
                    setCooldownTicks(0);
                    setWarmupTicks(60);
                  }
                  setDragNodes(checked);
                }}
              />
            </div>
            <div className="mt-4">
              <div className="font-medium">Show flags</div>
              <div className="text-hint text-xs">
                Help with navigation between folders
              </div>
            </div>
            <div className="py-2 rounded-2xl flex justify-end">
              <Switch
                label=""
                checked={showFlags}
                onChange={(checked) => {
                  if (checked) {
                    setCooldownTicks(undefined);
                    setWarmupTicks(undefined);
                  } else {
                    setCooldownTicks(0);
                    setWarmupTicks(60);
                  }
                  setShowFlags(checked);
                }}
              />
            </div>
          </div>
        </BottomModal>,
        document.body
      )}
    </div>
  );
};

const initializeGraphData = (folders: JazzListOfFolders): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  /* const centerNode = {
    id: "center",
    title: "My space",
    targets: [],
    type: GraphNodeType.TOPIC,
  }; */

  //nodes.push(centerNode as GraphNode);

  function processFolders(
    folders: JazzFolder[],
    nodes: GraphNode[],
    links: GraphLink[],
    nested: boolean
  ) {
    folders.forEach((folder) => {
      if (!folder) return;

      if (nested) {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: GraphNodeType.TOPIC,
          nested: true,
        });
      } else {
        nodes.push({
          id: folder.id,
          title: folder.title,
          targets: [],
          type: GraphNodeType.TOPIC,
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
          type: GraphNodeType.DIALOG,
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

const isNodeOnScreen = (
  node: NodeObject,
  graphRef: React.MutableRefObject<
    | ForceGraphMethods<
        {
          id: string | number;
        },
        {}
      >
    | undefined
  >,
  canvasHeight: number,
  canvasWidth: number
) => {
  if (!node.x || !node.y || !graphRef.current) return;

  const { x, y } = graphRef.current.graph2ScreenCoords(node.x, node.y);
  const isVisible = x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight;

  return { x, y, isVisible };
};

const clampPosition = (
  x: number,
  y: number,
  W: number,
  H: number,
  wInset: number,
  hInset: number
) => {
  const topInset =
    Number(
      getCssVariable("--tg-viewport-safe-area-inset-top").replace("px", "")
    ) +
    Number(
      getCssVariable("--tg-viewport-content-safe-area-inset-top").replace(
        "px",
        ""
      )
    ) +
    48 + // settings button height
    8; // additional margin
  let pointX = x;
  let pointY = y;

  if (x < 0) pointX = 0 + 10;
  if (x > W) pointX = W + wInset;
  if (y < topInset) pointY = topInset;

  if (y > H) pointY = H + hInset;

  const distance = Math.sqrt((pointX - x) ** 2 + (pointY - y) ** 2);

  return { x: pointX, y: pointY, distance };
};

const getTextWidth = (text: string, font = "14px Arial") => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx!.font = font;
  return ctx!.measureText(text).width;
};

export default memo(ForceGraph);
