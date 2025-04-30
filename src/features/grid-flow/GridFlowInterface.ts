import { GridFlowNodeType } from "./nodes/GridFlowNodes";

export const GRID_CELL_SIZE = 40;
/**
 * Avatars: 2x2 cells
 * Folder: 2x1 cells
 */

export interface GridFlowNode {
  id: string;
  type: GridFlowNodeType;
  data: {
    username: string;
    name: string;
  };
  position: {
    x: number;
    y: number;
  };
}
