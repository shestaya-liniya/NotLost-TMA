import { getCssVariable } from "@/helpers/css/get-css-variable";
import { IGraphNodeType, IGraphRef } from "../Graph.interface";
import getTextWidth from "@/helpers/getTextWidth";

import { NodeObject } from "react-force-graph-2d";
import { getMiniAppTopInset } from "@/helpers/css/get-top-tg-inset";
import { useGraphStore } from "../GraphContext";

export default function graphCalcFlagPosition(
  graphRef: IGraphRef,
  node: NodeObject
) {
  const { setFolderFlags, folderFlags } = useGraphStore.getState();

  if (graphRef && node.type === IGraphNodeType.FOLDER && !node.nested) {
    const MARGIN = 0;
    const SCREEN_WIDTH = window.innerWidth - MARGIN;
    const SCREEN_HEIGHT =
      Number(getCssVariable("--initial-height").replace("px", "")) - MARGIN;

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
        -getTextWidth(node.title) - 10,
        -MARGIN
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
  wInset: number,
  hInset: number
) => {
  const SETTINGS_BUTTON_HEIGHT = 48;
  const MARGIN = 8;

  const topInset = getMiniAppTopInset() + SETTINGS_BUTTON_HEIGHT + MARGIN;

  let pointX = x;
  let pointY = y;

  if (x < 0) pointX = 0 + 10;
  if (x > W) pointX = W + wInset;
  if (y < topInset) pointY = topInset;

  if (y > H) pointY = H + hInset;

  const distance = Math.sqrt((pointX - x) ** 2 + (pointY - y) ** 2);

  return { x: pointX, y: pointY, distance };
};
