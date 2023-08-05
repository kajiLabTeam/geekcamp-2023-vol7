import { NodeObject } from "@/components/util/type";

// apiを叩く
async function fetchApi<T>(path: string) {
  const url = new URL(path, "http://localhost:3000/api/");

  return fetch(url).then((res) => {
    return res.json() as T;
  });
}

// ノードの情報を取得する
export async function fetchNode(nodeId: number): Promise<NodeObject> {
  return fetchApi<NodeObject>(`/node/${nodeId}`);
}
