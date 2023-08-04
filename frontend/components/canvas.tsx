import { currentNodeState, isDialogOpenState } from "@/const/recoil/state";
import fetchLinkNodes from "@/foundation/graph/fetchLinkNodes";
import nodeAddLabel from "@/foundation/graph/nodeAddLabel";
import { GraphData, Link, Node } from "@/foundation/graph/types";
import styles from "@styles/components/canvas.module.scss";
import { useCallback, useRef, useState } from "react";
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { useSetRecoilState } from "recoil";
import { linksData, nodesData } from "../const/testData";

export default function Canvas() {
  const setCurrentNode = useSetRecoilState(currentNodeState);
  const currentNodeRef = useRef<Node>({ ...nodesData[0] });
  const setIsDialogOpen = useSetRecoilState(isDialogOpenState);

  const [graphData, setGraphData] = useState<GraphData>(() => nodeAddLabel({ links: linksData, nodes:nodesData }));
  const graphRef = useRef<ForceGraphMethods<Node, Link>>(null!);

  console.log(currentNodeRef.current);
  const drawWithLabel = useCallback<(obj: Node, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    async (node, ctx, globalScale) => {
      const currentNode = currentNodeRef.current;
      if (currentNode && currentNode.id === node.id) {
        const { x, y } = node;
        if (x == null || y == null) return;

        ctx.beginPath();
        ctx.arc(x, y, Math.sqrt(node.val) * 3, 0, Math.PI * 2, true);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    []
  )

  const drawLinks = useCallback<(obj: { source?: string | number | Node, target?: string | number | Node }, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    ({ source, target }, ctx, globalScale) => {
      if (typeof source !== 'object' || typeof target !== 'object') return;

      const { x: sx, y: sy, name } = source;
      const { x: tx, y: ty } = target;
      if (sx == null || sy == null || tx == null || ty == null || !name) return;

      const fontSize = 12 * Math.sqrt(source.val) / Math.min(4, Math.max(globalScale, 1));
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(name).width;
      const textAngle = Math.atan2(ty - sy, tx - sx);
      const isFlip = textAngle < -Math.PI / 2 || Math.PI / 2 < textAngle

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(textAngle);
      ctx.translate(textWidth / 2 + Math.sqrt(source.val) * 4 + 1 / globalScale, 0);
      if (isFlip) ctx.rotate(Math.PI);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillText(name, 0, 0);
      ctx.restore();
    },
    []
  )

  const onNodeClick = useCallback<(node: Node, event: MouseEvent) => void>(async node => {
    const currentNode = currentNodeRef.current;
    if (currentNode && currentNode.id === node.id) {
      setIsDialogOpen(true);
    } else {
      if (currentNode) {
        currentNode.fx = undefined;
        currentNode.fy = undefined;
      }
      node.fx = node.x;
      node.fy = node.y;
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(4, 1000);
    }

    if (!node.isOpened) {
      node.isOpened = true;
      const linkData = await fetchLinkNodes(node.id);
      const linkDataWithLabel = nodeAddLabel(linkData);

      setGraphData(v => ({
        nodes: [...v.nodes, ...linkDataWithLabel.nodes],
        links: [...v.links, ...linkDataWithLabel.links]
      }));
    }


    currentNodeRef.current = node;
    setCurrentNode({ ...node });
  }, []);

  return (
    <div className={styles.canvas}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        backgroundColor="#FFF9F1"
        onNodeClick={onNodeClick}
        nodeColor={node => node.isOpened ? "#000000" : "#75BEC2"}
        nodeCanvasObjectMode={() => "after"}
        // nodeCanvasObjectMode={node => node.id === currentNodeRef.current.id ? "after" : "none"}
        nodeCanvasObject={drawWithLabel}
        linkCanvasObjectMode={link => link.isLabel ? "replace" : "none"}
        linkCanvasObject={drawLinks}
        nodeVisibility={node => !!node.name}
      />
    </div>
  );
}
