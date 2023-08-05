import {
  ArticleObject,
  NodeConnectData,
  NodeObject,
  SearchNodeObject,
  SuggestionObject,
} from "@/components/util/type";

// ノードの情報を取得する
export async function fetchNode(nodeId: number): Promise<NodeObject> {
  const response = await fetch(`/api/node/${nodeId}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = (await response.json()) as NodeObject;

  return data;
}

// wordを検索する
export async function fetchSearchWord(
  word: string
): Promise<SearchNodeObject | SuggestionObject> {
  const response = await fetch(`/api/node/search?query=${word}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = (await response.json()) as SearchNodeObject | SuggestionObject;

  return data;
}

// ノードの関係を取得する
export async function fetchNodeConnect(
  nodeId: number
): Promise<NodeConnectData> {
  const response = await fetch(`/api/nodes/connect/${nodeId}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = (await response.json()) as NodeConnectData;

  return data;
}

// 記事を取得する
export async function fetchArticle(nodeId: number): Promise<ArticleObject> {
  const response = await fetch(`/api/article/info/${nodeId}`);
  console.log(response);
  
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = (await response.json()) as ArticleObject;

  return data;
}
