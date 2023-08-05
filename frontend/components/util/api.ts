import {
  NodeObject,
  SearchNodeObject,
  SuggestionObject,
} from "@/components/util/type";

// apiを叩く
async function fetchApi<T>(path: string, params?: any) {
  const url = new URL(path, "http://localhost:3000/api/");

  let fullPath;
  if (params) fullPath = `${url}?${params.toString()}`;
  else fullPath = url;

  return fetch(fullPath).then((res) => {
    return res.json() as T;
  });
}

// ノードの情報を取得する
export async function fetchNode(nodeId: number): Promise<NodeObject> {
  return fetchApi<NodeObject>(`/node/${nodeId}`);
}

// wordを検索する
export async function fetchSearchWord(
  word: string
): Promise<SearchNodeObject | SuggestionObject> {
  const params = new URLSearchParams();
  params.append("query", word);

  return fetchApi<SearchNodeObject | SuggestionObject>("/node/search", params);
}
