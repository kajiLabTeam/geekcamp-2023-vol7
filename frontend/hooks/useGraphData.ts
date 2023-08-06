import { NodeConnectData } from "@/components/util/type";
import { recoilKeyHashSet } from "@/const/recoil/keys";
import { GraphData, Link, Node } from "@/foundation/graph/types";
import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

type LinkKey = `${number}=${number}`;

const nodesMapState = atom({
  key: recoilKeyHashSet.nodesMap,
  default: new Map<number, Node>(),
  dangerouslyAllowMutability: true
});

const linksMapState = atom({
  key: recoilKeyHashSet.linksMap,
  default: new Map<LinkKey, Link>(),
  dangerouslyAllowMutability: true
});

const graphDataState = atom<GraphData>({
  key: recoilKeyHashSet.graphData,
  default: { nodes: [], links: [] },
  dangerouslyAllowMutability: true
});

export default function useGraphData() {
  const [graphData, setGraphData] = useRecoilState(graphDataState);
  const [nodesMap] = useRecoilState(nodesMapState);
  const [linksMap] = useRecoilState(linksMapState);

  const addConnection = useCallback((connectData: NodeConnectData) => {
    const rootId = connectData.currentNode.id;

    for (const node of [connectData.currentNode, ...connectData.relationNode]) {
      const nodeId = node.id;
      const key = getLinkKey(rootId, nodeId);

      const mainNode: Node = {
        id: nodeId,
        name: node.name,
        articleId: node.articleId,
        val: node.childNodeNum,
        connectNum: 0
      };

      if (!nodesMap.has(nodeId)) {
        const labelId = -nodeId;
        const labelLinkKey = getLinkKey(nodeId, labelId);

        const labelNode: Node = {
          id: labelId,
          val: node.childNodeNum,
          connectNum: 0
        };

        const labelLink: Link = {
          source: mainNode,
          target: labelNode,
          isLabel: true
        };

        nodesMap.set(nodeId, mainNode);
        nodesMap.set(labelId, labelNode);
        linksMap.set(labelLinkKey, labelLink);
      }

      // TODO: 仮
      const currentNode = nodesMap.get(rootId)!;

      if (!linksMap.has(key)) {
        linksMap.set(key, {
          source: currentNode,
          target: mainNode
        });

        for (const id of [rootId, nodeId]) {
          const connectNode = nodesMap.get(id);
          if (connectNode?.connectNum != null) {
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
  }, [nodesMap, linksMap]);

  const getNode = useCallback((nodeId: number) => (
    nodesMap.get(nodeId)
  ), [nodesMap]);

  return { graphData, addConnection, getNode };
}

const getLinkKey = (source: number, target: number): LinkKey =>
  source < target
    ? `${source}=${target}`
    : `${target}=${source}`;
