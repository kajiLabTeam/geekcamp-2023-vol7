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

export type NodeConnectData = {
  currentNode: NodeObject;
  relationNode: NodeObject[];
};
