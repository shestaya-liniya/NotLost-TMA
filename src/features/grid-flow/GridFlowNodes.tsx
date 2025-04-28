import CustomNode, { NodeShadow } from "./GridFlowCustomNode";

export const nodeTypes = {
  custom: CustomNode,
  shadow: NodeShadow,
};

export const initNodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 20, y: 50 },
    data: {
      username: "shestaya_liniya",
      name: "Andrei",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 20, y: 200 },
    data: {
      username: "skywl_k",
      name: "Andrei",
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 200, y: 200 },
    data: {
      username: "kopolinaa",
      name: "Polina design",
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 250, y: 250 },
    data: {
      username: "devs_cis",
      name: "Telegram Developers Community (CIS)",
    },
  },
];
