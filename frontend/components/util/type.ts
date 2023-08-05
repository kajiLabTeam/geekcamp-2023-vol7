export type LastUpdate = `${number}.${number}.${number}`;

export type NodeObject = {
  id: number;
  name: string;
  articleId: number;
  lastUpdate: LastUpdate;
};

export type ArticleObject = {
  id: number;
  nodeId: number;
  content: string;
  lastUpdate: LastUpdate;
};

export type ApiConnectResponse = {
  currentNode: NodeObject;
  relationNode: NodeObject[];
} | null;
