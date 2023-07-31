import styles from "@styles/common/canvas.module.scss";

export default function Canvas({
  selectNode,
}: {
  selectNode: (nodeId: number) => void;
}) {
  return <canvas className={styles.canvas}></canvas>;
}
