import { IGraphRef } from "../Graph.interface";

export function graphZoomToNode(graphRef: IGraphRef, nodeId: string) {
  const PADDING = 175; // depends on screen resolution, 175 is optimal for average screens
  const DURATION_MILLS = 500;

  graphRef?.current?.zoomToFit(
    DURATION_MILLS,
    PADDING,
    (filterNode) => filterNode.id === nodeId
  );
}
