export type LastUpdate = `${number}.${number}.${number}`;

export type NodeObject = {
  nodeId: number;
  name: string;
  articleId: number;
  childNodeNum : number;
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
