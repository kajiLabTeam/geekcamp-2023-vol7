import { currentNodeIdState, isDialogOpenState } from "@/const/recoil/state";
import useDomSize from "@/hooks/useDomSize";
import useGraphData from "@/hooks/useGraphData";
import styles from "@styles/components/canvas.module.scss";
import { useCallback, useEffect, useRef } from "react";
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import { useRecoilState, useSetRecoilState } from "recoil";
import { fetchNodeConnect } from "./util/api";
import { GraphLink, GraphNode } from "./util/type";

export default function Canvas() {
  const [wrapperRef, size] = useDomSize<HTMLDivElement>();

  return (
    <div className={styles.canvas} ref={wrapperRef}>
      {size && <ForceGraphField {...size} />}
    </div>
  );
}

function ForceGraphField (props: { width: number, height: number }) {
  const { width, height } = props;
  const isFirst = useRef(true);
  const [currentNodeId, setCurrentNodeId] = useRecoilState(currentNodeIdState);
  const setIsDialogOpen = useSetRecoilState(isDialogOpenState);

  const { graphData, addConnection, getNode } = useGraphData();
  const graphRef = useRef<ForceGraphMethods<GraphNode, GraphLink>>(null!);

  useEffect(() => {
    if (!isFirst.current) return;
    isFirst.current = false;
    fetchNodeConnect(currentNodeId)
      .then(connectData => {
        if (connectData == null) throw new Error("ノードの読み込みに失敗しました");
        addConnection(connectData);
        return connectData;
      });

    graphRef.current.d3Force("charge")
      ?.strength(() => -5e2);

    graphRef.current.d3Force('link')
      ?.distance((link: GraphLink) => Math.min(link.source.connectIds.length, link.target.connectIds.length) * 5 + 30);
  }, [addConnection, currentNodeId]);

  useEffect(() => {
    const currentNode = getNode(currentNodeId);
    if (currentNode == null) return;
    currentNode.fx = currentNode.x;
    currentNode.fy = currentNode.y;
    graphRef.current.centerAt(currentNode.x, currentNode.y, 1000);

    return () => {
      if (currentNode) {
        currentNode.fx = undefined;
        currentNode.fy = undefined;
      }
    };
  }, [currentNodeId, getNode]);

  const drawWithLabel = useCallback<(obj: GraphNode, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    async (node, ctx, globalScale) => {
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
    [currentNodeId]
  )

  const drawLinks = useCallback<(obj: { source?: string | number | GraphNode, target?: string | number | GraphNode }, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    ({ source, target }, ctx, globalScale) => {
      if (typeof source !== 'object' || typeof target !== 'object') return;

      const { x: sx, y: sy, name } = source;
      const { x: tx, y: ty } = target;
      if (sx == null || sy == null || tx == null || ty == null || !name) return;

      const fontSize = Math.min(12 * Math.sqrt(source.val) / Math.min(4, Math.max(globalScale, 1)), 24);
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

  const onNodeClick = useCallback<(node: GraphNode, event: MouseEvent) => void>(async node => {
    if (node.connectIds.length < node.val) {
      const connectData = await fetchNodeConnect(node.id);
      if (connectData) {
        addConnection(connectData);
      }
    } else if (currentNodeId === node.id) {
      setIsDialogOpen(true);
    }

    setCurrentNodeId(node.id);
  }, [addConnection, currentNodeId, setCurrentNodeId, setIsDialogOpen]);

  return (
    <ForceGraph2D
      ref={graphRef}
      width={width}
      height={height}
      graphData={graphData}
      backgroundColor="#FFF9F1"
      onNodeClick={onNodeClick}
      nodeColor={node => node.connectIds.length >= node.val ? "#000000" : "#75BEC2"}
      nodeCanvasObjectMode={node => node.id === currentNodeId ? "after" : "none"}
      nodeCanvasObject={drawWithLabel}
      linkCanvasObjectMode={link => link.isLabel ? "replace" : "none"}
      linkCanvasObject={drawLinks}
      nodeVisibility={node => !!node.name}
    />
  );
}
