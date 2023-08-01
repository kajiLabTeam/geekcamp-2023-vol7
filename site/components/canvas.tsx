import styles from "@styles/components/canvas.module.scss";
import { useCallback, useRef, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import { nodesData, linksData, Link, Node } from "./const/testData";

type Props = {
  setNodeId: (nodeId: number) => void;
  setNodeName: (nodeName: string) => void;
  openDirlog: () => void;
}

export default function Canvas(props: Props) {
  const { setNodeId, setNodeName, openDirlog } = props;
  const currentNode = useRef<string>();
  const [nodes, setNodes] = useState<Node[]>(nodesData);
  const [links, setLinks] = useState<Link[]>(linksData);

  const onNodeClick = useCallback<(node: Node, event: MouseEvent) => void>(node => {
    if (currentNode.current === node.id) openDirlog();
    currentNode.current = node.id;
    setNodeId(Number(node.id));
    setNodeName(node.name);
  }, []);

  return (
    <div className={styles.canvas}>
      <ForceGraph2D
        graphData={{ nodes, links }}
        backgroundColor="#FFF9F1"
        onNodeClick={onNodeClick}
      />
    </div>
  );
}
