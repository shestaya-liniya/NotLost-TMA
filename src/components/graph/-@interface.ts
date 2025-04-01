export type GraphNodeImageCache = {
  [key: string]: HTMLImageElement;
};

export interface GraphLink {
  source: string;
  target: string;
}

export enum GraphNodeType {
  TOPIC = "topic",
  TAG = "tag",
  DIALOG = "dialog",
}

export interface GraphNodeTopic {
  id: string;
  title: string;
  targets: (GraphNodeDialog | GraphNodeTag)[]; // as topic can links to tag or to contact
  type: GraphNodeType.TOPIC;
  nested?: boolean;
}

export type GraphNodeTag = {
  id: string;
  title: string;
  source: string;
  targets: (GraphNodeDialog | GraphNodeTag)[]; // as tag can be sub-tag (dev tag -> front tag -> contact)
  type: GraphNodeType.TAG;
};

export interface GraphNodeDialog {
  id: string;
  username: string;
  firstName: string;
  tags: string[];
  type: GraphNodeType.DIALOG;
}

export type GraphNode = GraphNodeDialog | GraphNodeTag | GraphNodeTopic;

export interface GraphData {
  links: GraphLink[];
  nodes: GraphNode[];
}
