import {
  IGraphNodeType,
  IGraphNodeImageCache,
  IGraphRef,
  IGraphNode,
} from "../../Graph.interface";
import graphUpdateFolderFlag from "../graphUpdateFolderFlag";
import { graphDrawDialog } from "./graphDrawDialog";
import { graphDrawFolder } from "./graphDrawFolder";

export default function graphDrawNode(
  imageCache: IGraphNodeImageCache,
  graphRef: IGraphRef,
  node: IGraphNode,
  ctx: CanvasRenderingContext2D,
  globalScale: number
) {
  const img = imageCache[node.id!];

  graphUpdateFolderFlag(graphRef, node);

  switch (node.type) {
    case IGraphNodeType.DIALOG:
      graphDrawDialog(node, ctx, globalScale, img);
      break;
    case IGraphNodeType.FOLDER:
      graphDrawFolder(node, ctx, img);
      break;
  }
}
