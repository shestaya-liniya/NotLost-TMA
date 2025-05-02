import { getMiniAppTopInset } from "@/helpers/css/getMiniAppTopInset";
import {
  GRID_CELL_SIZE,
  GRID_PADDING,
  GridFlowNode,
} from "./GridFlowInterface";
import { v4 } from "uuid";

export const getExtent = (val: number): number => {
  return Math.floor(val / GRID_CELL_SIZE) * GRID_CELL_SIZE;
};

export const fixNodePosition = (
  node: GridFlowNode,
  setNodes: (updater: (prev: GridFlowNode[]) => GridFlowNode[]) => void,
  position?: { x: number; y: number }
) => {
  const rawPos = position ? position : { ...node.position };

  const snappedPos = {
    x: Math.round(rawPos.x / 20) * 20,
    y: Math.round(rawPos.y / 20) * 20,
  };

  // avoid zero positioning
  if (snappedPos.x === 0) snappedPos.x = 20;
  if (snappedPos.y === 0) snappedPos.y = 20;

  if (snappedPos.x !== node.position.x || snappedPos.y !== node.position.y) {
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, position: snappedPos } : n))
    );
  }
};

const createOccupiedGrid = (nodes: GridFlowNode[]) => {
  const gridCols = Math.floor(
    (getExtent(window.innerWidth) - GRID_PADDING) / GRID_CELL_SIZE
  );
  const gridRows = Math.floor(
    (getExtent(window.innerHeight - getMiniAppTopInset()) - GRID_PADDING) /
      GRID_CELL_SIZE
  );

  const createGridMatrix = (cols: number, rows: number) => {
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        row,
        col,
        occupied: false,
      }))
    );
  };

  const positionToGridCellsIndexes = (x: number, y: number) => ({
    col: Math.floor((x - GRID_PADDING) / GRID_CELL_SIZE),
    row: Math.floor((y - GRID_PADDING) / GRID_CELL_SIZE),
  });

  const markOccupied = (
    fromRow: number,

    fromCol: number,
    markRowsNum: number,
    markColsNum: number
  ) => {
    for (let dy = 0; dy < markRowsNum; dy++) {
      for (let dx = 0; dx < markColsNum; dx++) {
        if (gridMatrix[fromRow + dy][fromCol + dx]) {
          gridMatrix[fromRow + dy][fromCol + dx].occupied = true;
        }
      }
    }
  };

  const gridMatrix = createGridMatrix(gridCols, gridRows);

  nodes.forEach((node) => {
    const { col, row } = positionToGridCellsIndexes(
      node.position.x,
      node.position.y
    );

    if (node.type === "chat") {
      markOccupied(row, col, 2, 2);
    } else if (node.type === "folder") {
      markOccupied(row, col, 2, 4);
    }
  });

  return gridMatrix;
};

/* const printGridMatrix = (gridMatrix: { occupied: boolean }[][]) => {
  const output = gridMatrix
    .map((row) => row.map((cell) => (cell.occupied ? "🟥" : "⬛")).join(" "))
    .join("\n");
  console.log(output);
}; */

export const findFreeSpace = (
  nodes: GridFlowNode[],
  heightInCells: number,
  widthInCells: number
): { x: number; y: number } | null => {
  const gridMatrix = createOccupiedGrid(nodes);
  const gridRows = gridMatrix.length;
  const gridCols = gridMatrix[0].length;

  for (let row = 0; row <= gridRows - heightInCells; row++) {
    for (let col = 0; col <= gridCols - widthInCells; col++) {
      let fits = true;

      for (let dy = 0; dy < heightInCells; dy++) {
        for (let dx = 0; dx < widthInCells; dx++) {
          if (gridMatrix[row + dy][col + dx].occupied) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }

      if (fits) {
        return {
          x: (col + 1) * GRID_CELL_SIZE - GRID_PADDING,
          y: (row + 1) * GRID_CELL_SIZE - GRID_PADDING,
        };
      }
    }
  }

  return null; // No free space found
};

export const gridFlowAddNode = (
  nodeData: {
    type: GridFlowNode["type"];
    data: GridFlowNode["data"];
  },
  nodes: GridFlowNode[],
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>
) => {
  const dim =
    nodeData.type === "chat"
      ? { height: 2, width: 2 }
      : { height: 2, width: 4 };

  const freeSpace = findFreeSpace(nodes, dim.height, dim.width);
  if (freeSpace) {
    const newNodeId = v4();
    const newNode: GridFlowNode = {
      id: newNodeId,
      type: nodeData.type,
      data: nodeData.data,
      position: freeSpace,
      className: "animate-fadeIn",
    };
    setNodes((nds) => nds.concat(newNode as GridFlowNode));

    setTimeout(() => {
      setNodes((ns) =>
        ns.map((n) => {
          if (n.id === newNodeId) {
            return { ...n, className: "" };
          }
          return n;
        })
      );
    }, 300);
  }
};

export const gridFlowDeleteNode = (
  nodeId: string,
  setNodes: React.Dispatch<React.SetStateAction<GridFlowNode[]>>
) => {
  setNodes((ns) =>
    ns.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            data: {
              ...n.data,
              status: "deleting",
            },
          }
        : n
    )
  );

  setTimeout(() => {
    setNodes((ns) => ns.filter((n) => n.id !== nodeId));
  }, 300);
};
