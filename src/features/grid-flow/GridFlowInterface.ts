import WorkspaceChatBlock, {
  NodeShadow,
} from "@/screens/workspace/blocks/WorkspaceChatBlock";
import WorkspaceFolderBlock from "@/screens/workspace/blocks/WorkspaceFolderBlock";
import { Node } from "@xyflow/react";

export const GRID_CELL_SIZE = 40;
export const GRID_PADDING = 20;
/**
 * Avatars: 2x2 cells
 * Folder: 2x1 cells
 */

export type GridFlowChatNodeData = {
  username: string;
  label: string;
  deleteMode?: boolean;
  status?: "adding" | "deleting" | null;
};

export type GridFlowFolderNodeData = {
  title: string;
  chats: { username: string; label: string }[];
  deleteMode?: boolean;
  status?: "adding" | "deleting" | null;
};

export type GridFlowNodeType = "chat" | "folder" | "shadow";

type ChatNode = Node<GridFlowChatNodeData> & { type: "chat" };
type FolderNode = Node<GridFlowFolderNodeData> & { type: "folder" };
type ShadowNode = Node & { type: "shadow" };

export type GridFlowNode = ChatNode | FolderNode | ShadowNode;

export const GridFlowNodeTypes = {
  chat: WorkspaceChatBlock,
  folder: WorkspaceFolderBlock,
  shadow: NodeShadow,
};
