import { ApiConnectResponse } from "@/components/util/type";
import { GraphData, Link, Node } from "@/foundation/graph/types";
import { useRef, useState } from "react";

type LinkKey = `${number}=${number}`;

export default function useGraphData() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const nodesMap = useRef(new Map<number, Node>()).current;
  const linksMap = useRef(new Map<LinkKey, Link>()).current;

  const fetchConnectNode = async (rootId: number) => {
    const response = await fetch(`/api/nodes/connect/${rootId}`);
    if (!response.ok) throw Error(`${response.status}: ${response.statusText}`);
    const data = await response.json() as ApiConnectResponse;
    if (data == null) throw Error("data is null");

    for (const node of [data.currentNode, ...data.relationNode]) {
      const nodeId = node.nodeId;
      const key = getLinkKey(rootId, nodeId);

      if (!nodesMap.has(nodeId)) {
        nodesMap.set(nodeId, {
          id: nodeId,
          name: node.name,
          articleId: node.articleId,
          val: 10
        });

        const labelId = -nodeId;
        const labelLinkKey = getLinkKey(nodeId, labelId);
        nodesMap.set(labelId, {
          id: labelId,
          val: 10
        });

        linksMap.set(labelLinkKey, {
          source: nodeId,
          target: labelId,
          isLabel: true
        });
      }

      if (!linksMap.has(key)) {
        linksMap.set(key, {
            source: rootId,
            target: node.nodeId
        });
      }
    }

    const currentNode = nodesMap.get(rootId)!;
    currentNode.isOpened = true;

    setGraphData({
      nodes: [...nodesMap.values()],
      links: [...linksMap.values()],
    });

    return currentNode;
  }

  return { graphData, fetchConnectNode };
}

const getLinkKey = (source: number, target: number): LinkKey =>
  source < target
    ? `${source}=${target}`
    : `${target}=${source}`;
