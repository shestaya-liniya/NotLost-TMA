import { GridFlowNode } from "../GridFlowInterface";
import GridFlowChatNode, { NodeShadow } from "./GridFlowChatNode";
import GridFlowFolderNode from "./GridFlowFolderNode";

export type GridFlowNodeType = "chat" | "folder" | "shadow";

export const GridFlowNodeTypes = {
  chat: GridFlowChatNode,
  folder: GridFlowFolderNode,
  shadow: NodeShadow,
};

export const initNodes: GridFlowNode[] = [
  {
    id: "1",
    type: "chat",
    position: { x: 20, y: 20 },
    data: {
      username: "shestaya_liniya",
      name: "Andrei",
    },
  },
  {
    id: "2",
    type: "chat",
    position: { x: 100, y: 20 },
    data: {
      username: "skywl_k",
      name: "Andrei",
    },
  },
  {
    id: "3",
    type: "chat",
    position: { x: 180, y: 20 },
    data: {
      username: "kopolinaa",
      name: "polina design",
    },
  },

  {
    id: "4",
    type: "chat",
    position: { x: 260, y: 20 },
    data: {
      username: "devs_cis",
      name: "Telegram Developers Community (CIS)",
    },
  },
  {
    id: "5",
    type: "folder",
    position: { x: 0, y: 300 },
    data: {
      username: "devs_cis",
      name: "Telegram Developers Community (CIS)",
      status: "adding",
    },
  },
  {
    id: "6",
    type: "folder",
    position: { x: 0, y: 350 },
    data: {
      username: "devs_cis",
      name: "Telegram Developers Community (CIS)",
    },
  },
  {
    id: "7",
    type: "folder",
    position: { x: 0, y: 400 },
    data: {
      username: "devs_cis",
      name: "Telegram Developers Community (CIS)",
      status: "adding",
    },
  },
];
