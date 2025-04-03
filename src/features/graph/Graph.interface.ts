import { ForceGraphMethods, NodeObject } from "react-force-graph-2d";

export type IGraphRef = React.MutableRefObject<
  | ForceGraphMethods<{
      id: string | number;
    }>
  | undefined
>;

export type IGraphNodeImageCache = {
  [key: string]: HTMLImageElement;
};

export interface IGraphLink {
  source: string;
  target: string;
}

export enum IGraphNodeType {
  FOLDER = "folder",
  DIALOG = "dialog",
}

export interface IGraphNodeFolder extends NodeObject {
  id: string;
  title: string;
  targets: IGraphNodeDialog[];
  type: IGraphNodeType.FOLDER;
  nested?: boolean;
}

export interface IGraphNodeDialog extends NodeObject {
  id: string;
  username: string;
  firstName: string;
  tags: string[];
  type: IGraphNodeType.DIALOG;
}

export type IGraphNode = IGraphNodeDialog | IGraphNodeFolder;

export interface IGraphData {
  links: IGraphLink[];
  nodes: IGraphNode[];
}

export interface IGraphFolderFlag {
  id: string;
  title: string;
  x: number;
  y: number;
  distance: number;
  visible: boolean;
}
