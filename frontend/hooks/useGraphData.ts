import { GraphData, GraphLink, GraphNode, NodeConnectData, NodeObject } from "@/components/util/type";
import { recoilKeyHashSet } from "@/const/recoil/keys";
import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

type LinkKey = `${number}=${number}`;

const nodesMapState = atom({
  key: recoilKeyHashSet.nodesMap,
  default: new Map<number, GraphNode>(),
  dangerouslyAllowMutability: true
});

const linksMapState = atom({
  key: recoilKeyHashSet.linksMap,
  default: new Map<LinkKey, GraphLink>(),
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

  const addNode = useCallback((nodeObj: NodeObject): GraphNode => {
    const node: GraphNode = {
      id: nodeObj.id,
      name: nodeObj.name,
      articleId: nodeObj.articleId,
      val: nodeObj.childNodeNum,
      connectIds: [],
    };
    const labelId = -node.id;
    const labelLinkKey = getLinkKey(node.id, labelId);

    const labelNode: GraphNode = {
      id: labelId,
      val: node.connectIds.length,
      articleId: node.articleId,
      connectIds: []
    };

    const labelLink: GraphLink = {
      source: node,
      target: labelNode,
      isLabel: true
    };

    nodesMap.set(node.id, node);
    nodesMap.set(labelId, labelNode);
    linksMap.set(labelLinkKey, labelLink);

    return node;
  }, [linksMap, nodesMap]);

  const addConnection = useCallback((connectData: NodeConnectData) => {
    const { currentNode } = connectData;
    const rootFGNode = nodesMap.get(currentNode.id) ?? addNode(connectData.currentNode);

    for (const nodeObj of connectData.relationNode) {
      const node = nodesMap.get(nodeObj.id) ?? addNode(nodeObj);

      const key = getLinkKey(rootFGNode.id, nodeObj.id);
      if (rootFGNode.id !== node.id && !linksMap.has(key)) {
        linksMap.set(key, {
          source: rootFGNode,
          target: node
        });

        nodesMap.get(rootFGNode.id)?.connectIds.push(nodeObj.id);
        nodesMap.get(nodeObj.id)?.connectIds.push(rootFGNode.id);
      }
    }

    setGraphData({
      nodes: [...nodesMap.values()],
      links: [...linksMap.values()],
    });

    return nodesMap.get(currentNode.id)!;
  }, [nodesMap, addNode, setGraphData, linksMap]);

  const getNode = useCallback((nodeId: number) => (
    nodesMap.get(nodeId)
  ), [nodesMap]);

  return { graphData, addConnection, getNode };
}

const getLinkKey = (source: number, target: number): LinkKey =>
  source < target
    ? `${source}=${target}`
    : `${target}=${source}`;
