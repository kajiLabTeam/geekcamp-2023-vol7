export type LastUpdate = `${number}.${number}.${number}`;

export type NodeObject = {
  id: number;
  name: string;
  articleId: number;
  childNodeNumber: number;
};

export type ArticleObject = {
  id: number;
  nodeId: number;
  article: string;
  lastUpdate: LastUpdate;
};

export type SearchNodeObject = {
  type: "node";
  currentNode: NodeObject;
  connectNodes: NodeObject[];
};

export type SuggestionObject = {
  type: "suggestion";
  suggestions: NodeObject[];
};
