import { NodeConnectData } from "@/components/util/type";
import { GraphData, Link, Node } from "@/foundation/graph/types";
import { useState } from "react";

type LinkKey = `${number}=${number}`;

const nodesMap = new Map<number, Node>();
const linksMap = new Map<LinkKey, Link>();

export default function useGraphData() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  const addConnection = (connectData: NodeConnectData) => {
    const rootId = connectData.currentNode.nodeId;

    for (const node of [connectData.currentNode, ...connectData.relationNode]) {
      const nodeId = node.nodeId;
      const key = getLinkKey(rootId, nodeId);

      if (!nodesMap.has(nodeId)) {
        nodesMap.set(nodeId, {
          id: nodeId,
          name: node.name,
          articleId: node.articleId,
          val: node.childNodeNum,
          connectNum: 0
        });

        const labelId = -nodeId;
        const labelLinkKey = getLinkKey(nodeId, labelId);
        nodesMap.set(labelId, {
          id: labelId,
          val: node.childNodeNum,
          connectNum: 0
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
          target: nodeId
        });

        for (const id of [rootId, nodeId]) {
          const connectNode = nodesMap.get(id);
          if (connectNode && connectNode.connectNum != null) {
            connectNode.connectNum++;
          }
        }
      }
    }

    setGraphData({
      nodes: [...nodesMap.values()],
      links: [...linksMap.values()],
    });

    return nodesMap.get(rootId)!;
  }

  return { graphData, addConnection };
}

const getLinkKey = (source: number, target: number): LinkKey =>
  source < target
    ? `${source}=${target}`
    : `${target}=${source}`;
