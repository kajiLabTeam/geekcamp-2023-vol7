type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
export type LastUpdate = `${Year}.${Month}.${Day}`;

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
}
