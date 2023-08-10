import {
  ArticleObject,
  NodeConnectData,
  SearchNodeObject,
  SuggestionObject,
} from "@/components/util/type";

function customFetch(url: string) {
  return new Promise<any>((resolve, reject) =>
    fetch(url).then((res) =>
      res.ok
        ? resolve(res.json())
        : reject(new Error(`${res.status}: ${res.statusText}`))
    )
  );
}

// wordを検索する
export function fetchSearchWord(
  word: string
): Promise<SearchNodeObject | SuggestionObject> {
  return customFetch(`/api/node/search?query=${word}`);
}

// ノードの関係を取得する
export async function fetchNodeConnect(
  nodeId: number
): Promise<NodeConnectData> {
  return customFetch(`/api/nodes/connect/${nodeId}`);
}

// 記事を取得する
export function fetchArticle(nodeId: number): Promise<ArticleObject> {
  return customFetch(`/api/article/info/${nodeId}`);
}

export async function submitArticle(
  articleId: number,
  article: string
): Promise<ArticleObject> {
  const res = await fetch(`/api/article/edit/${articleId}`, {
    method: "PUT",
    body: JSON.stringify({
      article: article,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());

  return res;
}
