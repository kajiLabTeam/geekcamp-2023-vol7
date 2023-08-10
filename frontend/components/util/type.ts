export type LastUpdate = `${number}.${number}.${number}`;

export type NodeObject = {
  id: number;
  name: string;
  articleId: number;
  childNodeNum: number;
};

export type ArticleObject = {
  id: number;
  name: string;
  nodeId: number;
  article: string;
  lastUpdate: LastUpdate;
};

export type SearchNodeObject = {
  type: "node";
  currentNode: NodeObject;
  relationNode: NodeObject[];
};

export type SuggestionObject = {
  type: "suggestion";
  suggestions: NodeObject[];
};

export type NodeConnectData = {
  currentNode: NodeObject;
  relationNode: NodeObject[];
};

export type GraphNode = {
  id: number;
  val: number;
  connectNum: number;
  articleId: number;
  x?: number | undefined;
  y?: number | undefined;
  vx?: number | undefined;
  vy?: number | undefined;
  fx?: number | undefined;
  fy?: number | undefined;
  name?: string;
};

export type GraphLink = {
  source: GraphNode;
  target: GraphNode;
  isLabel?: boolean;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};
