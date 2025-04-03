import { getCssVariable } from "@/helpers/css/get-css-variable";
import { IGraphNode, IGraphNodeType, IGraphRef } from "../Graph.interface";
import getTextWidth from "@/helpers/get-text-width";

import { NodeObject } from "react-force-graph-2d";
import { getMiniAppTopInset } from "@/helpers/css/get-mini-app-top-inset";
import { useGraphStore } from "../GraphStore";

export default function graphUpdateFolderFlag(
  graphRef: IGraphRef,
  node: IGraphNode
) {
  const { setFolderFlags, folderFlags } = useGraphStore.getState();

  if (graphRef && node.type === IGraphNodeType.FOLDER && !node.nested) {
    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = Number(
      getCssVariable("--initial-height").replace("px", "")
    );

    const nodeInfo = isNodeOnScreen(
      node,
      graphRef,
      SCREEN_HEIGHT,
      SCREEN_WIDTH
    );
    if (nodeInfo) {
      const { x, y, isVisible } = nodeInfo;
      const position = clampPosition(
        x,
        y,
        SCREEN_WIDTH,
        SCREEN_HEIGHT,
        getTextWidth(node.title)
      );

      const existingFlagIndex = folderFlags.findIndex(
        (flag) => flag.id === node.id
      );

      if (existingFlagIndex !== -1) {
        setFolderFlags(
          folderFlags.map((flag, index) =>
            index === existingFlagIndex
              ? {
                  ...flag,
                  id: String(node.id),
                  x: position.x,
                  y: position.y,
                  distance: position.distance,
                  visible: isVisible,
                }
              : flag
          )
        );
      } else {
        setFolderFlags([
          ...folderFlags,
          {
            id: String(node.id),
            title: node.title as string,
            x: position.x,
            y: position.y,
            distance: position.distance,
            visible: isVisible,
          },
        ]);
      }
    }
  }
}

const isNodeOnScreen = (
  node: NodeObject,
  graphRef: IGraphRef,
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
  textWidth: number
) => {
  // total wtf here

  const SETTINGS_BUTTON_HEIGHT = 48;
  const BOTTOM_MARGIN = 48;
  const TOP_MARGIN = 16;
  const LEFT_MARGIN = 24;
  const RIGHT_MARGIN = 48;

  const topInset = getMiniAppTopInset() + SETTINGS_BUTTON_HEIGHT + TOP_MARGIN;

  let pointX = x;
  let pointY = y;

  if (x < LEFT_MARGIN) pointX = LEFT_MARGIN;
  if (x + textWidth > W) pointX = W - textWidth - RIGHT_MARGIN;
  if (y < topInset) pointY = topInset;

  if (y + BOTTOM_MARGIN > H) pointY = H - BOTTOM_MARGIN;

  const distance = Math.sqrt((pointX - x) ** 2 + (pointY - y) ** 2);

  return { x: pointX, y: pointY, distance };
};
