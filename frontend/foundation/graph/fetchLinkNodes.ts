import { ApiConnectResponse, NodeObject } from "@/components/util/type";
import { GraphData, Node } from "./types";

export default async function fetchLinkNodes(currentId: number): Promise<GraphData & { current: Node }> {
  const response = await fetch(`/api/nodes/connect/${currentId}`);
  if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
  const data = await response.json() as ApiConnectResponse;
  if (data == null) throw Error("data is null");
  console.log(data);

  const current = nodeobject2Node(data.currentNode);

  const nodes = data.relationNode.map(nodeobject2Node);

  const links = nodes.map(({ id }) => ({
    source: currentId,
    target: id
  }));

  return { current, nodes, links };
}

const nodeobject2Node = (nodeobj: NodeObject): Node => ({
    id: Number(nodeobj.nodeId),
    name: nodeobj.name,
    articleId: nodeobj.articleId,
    val: 10
});
