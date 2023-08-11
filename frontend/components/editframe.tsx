import styles from "@/styles/components/editframe.module.scss";

export default function EditFrame() {
  return (
    <div className={styles.frame}>
      <div className={styles.line_1}></div>
      <div className={styles.line_2}></div>
      <div className={styles.line_3}></div>
      <div className={styles.line_4}></div>
    </div>
  );
}
