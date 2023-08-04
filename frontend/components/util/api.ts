import { NodeObject } from "@/components/util/type";

// apiを叩く
async function fetchApi<T>(path: string) {
  return fetch(`https://host/api/${path}`).then((res) => {
    return res.json() as T;
  });
}

// ノードの情報を取得する
export async function fetchNode(nodeId: number): Promise<NodeObject> {
  return fetchApi<NodeObject>(`node/${nodeId}`);
}
