import { currentNodeState, isDialogOpenState } from "@/const/recoil/state";
import fetchLinkNodes from "@/foundation/graph/fetchLinkNodes";
import nodeAddLabel from "@/foundation/graph/nodeAddLabel";
import { GraphData, Node } from "@/foundation/graph/types";
import styles from "@styles/components/canvas.module.scss";
import { useCallback, useState } from "react";
import ForceGraph2D from 'react-force-graph-2d';
import { useRecoilCallback, useSetRecoilState } from "recoil";
import { linksData, nodesData } from "../const/testData";

export default function Canvas() {
  const setCurrentNode = useSetRecoilState(currentNodeState);
  const getCurrentNode = useRecoilCallback(({ snapshot }) => () => snapshot.getPromise(currentNodeState));
  const setIsDialogOpen = useSetRecoilState(isDialogOpenState);

  const [graphData, setGraphData] = useState<GraphData>(() => nodeAddLabel({ links: linksData, nodes:nodesData }));

  const drawWithLabel = useCallback<(obj: Node, canvasContext: CanvasRenderingContext2D, globalScale: number) => void>(
    async (node, ctx, globalScale) => {
      const currentNode = await getCurrentNode();
      if (currentNode.id === node.id) {
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, Math.sqrt(node.val) * 3, 0, Math.PI * 2, true);
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
      const fontSize = 12 * Math.sqrt(source.val) / globalScale;
      ctx.font = `${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(source.nodeLabel!).width;
      const textAngle = Math.atan2(target.y! - source.y!, target.x! - source.x!);
      const isFlip = textAngle > Math.PI / 2 || textAngle < -Math.PI / 2

      ctx.save();
      ctx.translate(source.x!, source.y!);
      ctx.rotate(textAngle);
      ctx.translate(textWidth / 2 + Math.sqrt(source.val) * 4 + 1 / globalScale, 0);
      if (isFlip) ctx.rotate(Math.PI);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000000';
      ctx.fillText(source.nodeLabel!, 0, 0);
      ctx.restore();
    },
    []
  )

  const onNodeClick = useCallback<(node: Node, event: MouseEvent) => void>(async node => {
    const currentNode = await getCurrentNode();
    if (currentNode.id === node.id) setIsDialogOpen(true);
    if (!node.isOpened) {
      node.isOpened = true;
      const linkData = await fetchLinkNodes(node.id);
      const linkDataWithLabel = nodeAddLabel(linkData);

      setGraphData(v => ({
        nodes: [...v.nodes, ...linkDataWithLabel.nodes],
        links: [...v.links, ...linkDataWithLabel.links]
      }));
    }

    setCurrentNode({ ...node });
  }, []);

  return (
    <div className={styles.canvas}>
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="#FFF9F1"
        onNodeClick={onNodeClick}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={drawWithLabel}
        linkCanvasObjectMode={link => link.isLabel ? "replace" : "none"}
        linkCanvasObject={drawLinks}
        nodeVisibility={node => !node.id.startsWith("label_")}
      />
    </div>
  );
}
