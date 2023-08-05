import { ApiConnectResponse, NodeObject } from "@/components/util/type";
import { GraphData, Node } from "@/foundation/graph/types";
import { useState } from "react";

export default function useGraphData() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const fetchConnectNode = async (nodeId: number) => {
    const response = await fetch(`/api/nodes/connect/${nodeId}`);
    if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
    const data = await response.json() as ApiConnectResponse;
    if (data == null) throw Error("data is null");

    const nodes = [data.currentNode, ...data.relationNode].map(nodeobject2Node);
    nodes[0].isOpened = true;

    const links = nodes.map(({ id }) => ({
      source: nodeId,
      target: id
    }));

    const linkDataWithLabel = {
      nodes: [...nodes, ...nodes.map(v => ({ id: -v.id, val: 1 }))],
      links: [...links, ...nodes.map(v => ({ source: v.id, target: -v.id, isLabel: true }))]
    };

    setGraphData(v => ({
      nodes: [...v.nodes, ...linkDataWithLabel.nodes]
        .filter((v, i, a) => a.findIndex(w => v.id === w.id) === i),
      links: [...v.links, ...linkDataWithLabel.links]
        .filter((v, i, a) => a.findIndex(w => v.source === w.source && v.target === w.target) === i)
    }));

    return nodes[0];
  }

  return { graphData, fetchConnectNode };
}

const nodeobject2Node = (nodeobj: NodeObject): Node => ({
  id: Number(nodeobj.nodeId),
  name: nodeobj.name,
  articleId: nodeobj.articleId,
  val: 10
});
