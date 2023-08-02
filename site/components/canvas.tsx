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

  const drawWithLabel = useCallback<(obj: Node, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    (node, ctx, globalScale) => {
      const label = node.nodeLabel;
      if (label) {
        const fontSize = 12 * Math.sqrt(node.val) / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#000000";
        ctx.fillText(label, node.x! + textWidth / 2 + Math.sqrt(node.val) * 4 + 1 / globalScale, node.y!);
      }

      if (currentNode.current === node.id) {
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, Math.sqrt(node.val) * 3, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    []
  )

  const onNodeClick = useCallback<(node: Node, event: MouseEvent) => void>(node => {
    if (currentNode.current === node.id) openDirlog();
    currentNode.current = node.id;
    setNodeId(Number(node.id));
    setNodeName(node.name ?? "");
  }, []);

  return (
    <div className={styles.canvas}>
      <ForceGraph2D
        graphData={{ nodes, links }}
        backgroundColor="#FFF9F1"
        onNodeClick={onNodeClick}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={drawWithLabel}
      />
    </div>
  );
}
