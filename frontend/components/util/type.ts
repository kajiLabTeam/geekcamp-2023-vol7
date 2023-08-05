export type LastUpdate = `${number}.${number}.${number}`;

export type NodeObject = {
  id: number;
  name: string;
  articleId: number;
  childNodeNum: number;
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
