import { GraphData, GraphLink, GraphNode, NodeConnectData, NodeObject } from "@/components/util/type";
import { recoilKeyHashSet } from "@/const/recoil/keys";
import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

type LinkKey = `${number}=${number}`;

const graphDataState = atom<GraphData>({
  key: recoilKeyHashSet.graphData,
  default: { nodes: [], links: [] },
  dangerouslyAllowMutability: true
});

const nodesMap = new Map<number, GraphNode>();
const labelNodesMap = new Map<number, GraphNode>();
const linksMap = new Map<LinkKey, GraphLink>();
const labelLinksMap = new Map<LinkKey, GraphLink>();

export default function useGraphData() {
  const [graphData, setGraphData] = useRecoilState(graphDataState);

  const addNode = useCallback((nodeObj: NodeObject): GraphNode => {
    const node: GraphNode = {
      id: nodeObj.id,
      name: nodeObj.name,
      articleId: nodeObj.articleId,
      val: nodeObj.childNodeNum,
      connectIds: new Set(),
    };
    const labelId = -node.id;
    const labelLinkKey = getLinkKey(node.id, labelId);

    const labelNode: GraphNode = {
      id: labelId,
      val: node.connectIds.size,
      articleId: node.articleId,
      connectIds: new Set()
    };

    const labelLink: GraphLink = {
      source: node,
      target: labelNode,
      isLabel: true
    };

    nodesMap.set(node.id, node);
    labelNodesMap.set(labelId, labelNode);
    labelLinksMap.set(labelLinkKey, labelLink);

    return node;
  }, []);

  const deleateNode = useCallback((nodeId: number) => {
    const node = nodesMap.get(nodeId);
    const labelId = -nodeId;
    const labelLinkKey = getLinkKey(nodeId, labelId);

    for (const connectedId of node?.connectIds ?? []) {
      const connectedNode = nodesMap.get(connectedId);
      const connectedLinkKey = getLinkKey(nodeId, connectedId);
      linksMap.delete(connectedLinkKey);

      node?.connectIds.delete(connectedId);
      connectedNode?.connectIds.delete(nodeId);
    }

    nodesMap.delete(nodeId);
    labelNodesMap.delete(labelId);
    labelLinksMap.delete(labelLinkKey);
  }, []);

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

        nodesMap.get(rootFGNode.id)?.connectIds.add(nodeObj.id);
        nodesMap.get(nodeObj.id)?.connectIds.add(rootFGNode.id);
      }
    }

    setGraphData({
      nodes: [...nodesMap.values(), ...labelNodesMap.values()],
      links: [...linksMap.values(), ...labelLinksMap.values()],
    });

    return nodesMap.get(currentNode.id)!;
  }, [addNode, setGraphData]);

  const updateConnection = useCallback((connectData: NodeConnectData) => {
    const { currentNode } = connectData;
    const currentFGNode = nodesMap.get(currentNode.id);
    for (const connectedId of currentFGNode?.connectIds ?? []) {
      const connectedNode = nodesMap.get(connectedId);
      const shouldDelete = connectData.relationNode.every(node => node.id !== connectedId);
      if (connectedNode && connectedNode.connectIds.size <= 1 && shouldDelete) {
        deleateNode(connectedId);
      }
    }

    addConnection(connectData);
  }, [addConnection, deleateNode]);

  const getNode = useCallback((nodeId: number) => (
    nodesMap.get(nodeId)
  ), []);

  return { graphData, addConnection, updateConnection, getNode };
}

const getLinkKey = (source: number, target: number): LinkKey =>
  source < target
    ? `${source}=${target}`
    : `${target}=${source}`;
