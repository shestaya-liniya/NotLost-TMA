import { NodeObject } from "react-force-graph-2d";
import {
  IGraphNodeType,
  IGraphNodeImageCache,
  IGraphRef,
} from "../Graph.interface";
import graphCalcFlagPosition from "../helpers/graphCalcFlagPosition";
import { graphDrawDialog } from "./graphDrawDialog";
import { graphDrawFolder } from "./graphDrawFolder";

export default function graphDrawNode(
  imageCache: IGraphNodeImageCache,
  graphRef: IGraphRef,
  node: NodeObject,
  ctx: CanvasRenderingContext2D,
  globalScale: number
) {
  const img = imageCache[node.id!];

  graphCalcFlagPosition(graphRef, node);

  switch (node.type) {
    case IGraphNodeType.DIALOG:
      graphDrawDialog(node, ctx, globalScale, img);
      break;
    case IGraphNodeType.FOLDER:
      graphDrawFolder(node, ctx, img);
      break;
  }
}
