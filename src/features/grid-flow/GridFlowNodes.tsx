import CustomNode from "./GridFlowCustomNode";

export const nodeTypes = {
  custom: CustomNode,
};

export const initNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 20, y: 50 },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 20, y: 200 },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 200, y: 200 },
  },
];
