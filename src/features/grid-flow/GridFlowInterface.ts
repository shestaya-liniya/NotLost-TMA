import { Node } from "@xyflow/react";

export const GRID_CELL_SIZE = 40;
export const GRID_PADDING = 20;
/**
 * Avatars: 2x2 cells
 * Folder: 2x1 cells
 */

export interface GridFlowNode extends Node {
  data: {
    username: string;
    label: string;
    deleteMode?: boolean;
    status?: "adding" | "deleting" | null;
  };
}
