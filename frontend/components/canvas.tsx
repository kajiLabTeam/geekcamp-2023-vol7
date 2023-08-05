import { currentNodeIdState, isDialogOpenState } from "@/const/recoil/state";
import fetchConnectNodes from "@/foundation/fetchConnectNodes";
import { Link, Node } from "@/foundation/graph/types";
import useDomSize from "@/hooks/useDomSize";
import useGraphData from "@/hooks/useGraphData";
import styles from "@styles/components/canvas.module.scss";
import { useCallback, useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { useRecoilCallback, useSetRecoilState } from "recoil";

export default function Canvas() {
  const setCurrentNodeId = useSetRecoilState(currentNodeIdState);
  const getCurrentNodeId = useRecoilCallback(({ snapshot }) => () => snapshot.getLoadable(currentNodeIdState).getValue());
  const setIsDialogOpen = useSetRecoilState(isDialogOpenState);
  const [wrapperRef, size] = useDomSize<HTMLDivElement>();

  const { graphData, addConnection, getNode } = useGraphData();
  const graphRef = useRef<ForceGraphMethods<Node, Link>>(null!);

  useEffect(() => {
    const currentNodeId = getCurrentNodeId();
    fetchConnectNodes(currentNodeId)
      .then(connectData => {
        if (connectData == null) throw new Error("ノードの読み込みに失敗しました");
        addConnection(connectData);
        return connectData;
      });
  }, []);

  const drawWithLabel = useCallback<(obj: Node, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    async (node, ctx, globalScale) => {
      const currentNodeId = getCurrentNodeId();
      if (currentNodeId === node.id) {
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
    const currentNodeId = getCurrentNodeId();
    if (currentNodeId === node.id) {
      setIsDialogOpen(true);
    } else {
      const currentNode = getNode(currentNodeId);
      if (currentNode) {
        currentNode.fx = undefined;
        currentNode.fy = undefined;
      }
      node.fx = node.x;
      node.fy = node.y;
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(4, 1000);
    }

    if (node.connectNum < node.val) {
      const connectData = await fetchConnectNodes(node.id);
      if (connectData) {
        addConnection(connectData);
      }
    }

    setCurrentNodeId(node.id);
  }, []);

  return (
    <div className={styles.canvas} ref={wrapperRef}>
      {size && <ForceGraph2D
        ref={graphRef}
        width={size.width}
        height={size.height}
        graphData={graphData}
        backgroundColor="#FFF9F1"
        onNodeClick={onNodeClick}
        nodeColor={node => node.connectNum >= node.val ? "#000000" : "#75BEC2"}
        nodeCanvasObjectMode={node => node.id === getCurrentNodeId() ? "after" : "none"}
        nodeCanvasObject={drawWithLabel}
        linkCanvasObjectMode={link => link.isLabel ? "replace" : "none"}
        linkCanvasObject={drawLinks}
        nodeVisibility={node => !!node.name}
      />}
    </div>
  );
}
