import {
  ArticleObject,
  NodeConnectData,
  NodeObject,
  SearchNodeObject,
  SuggestionObject,
} from "@/components/util/type";

function customFetch (url: string) {
  return new Promise<any>((resolve, reject) =>
    fetch(url)
      .then(res => res.ok
        ? resolve(res.json())
        : reject(new Error(`${res.status}: ${res.statusText}`))
      )
  );
}

// ノードの情報を取得する
export function fetchNode(nodeId: number): Promise<NodeObject> {
  return customFetch(`/api/node/${nodeId}`);
}

// wordを検索する
export function fetchSearchWord(word: string): Promise<SearchNodeObject | SuggestionObject> {
  return customFetch(`/api/node/search?query=${word}`);
}

// ノードの関係を取得する
export async function fetchNodeConnect(nodeId: number): Promise<NodeConnectData> {
  return customFetch(`/api/nodes/connect/${nodeId}`);
}

// 記事を取得する
export function fetchArticle(nodeId: number): Promise<ArticleObject> {
  return customFetch(`/api/article/info/${nodeId}`);
}
