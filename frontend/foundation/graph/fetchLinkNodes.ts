import { ApiConnectResponse } from "@/components/util/type";
import { GraphData } from "./types";

export default async function fetchLinkNodes(currentId: number): Promise<GraphData> {
  const response = await fetch(`/api/nodes/connect/${currentId}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = await response.json() as ApiConnectResponse;
  if (data == null) throw Error("data is null");

  const nodes = data.relationNode.map(v => ({
    id: v.id,
    name: v.name,
    articleId: v.articleId,
    val: 10
  }));

  const links = nodes.map(({ id }) => ({
    source: currentId,
    target: id
  }));

  return { nodes, links };
}
