import styles from "@/styles/components/frame.module.scss";
import { type } from "os";

type Props = {
  revColor?: boolean;
};

export default function Frame({ revColor }: Props = { revColor: false }) {
  return (
    <div className={`${styles.frame} ${revColor ? styles.rev : ""}`}>
      <div className={styles.top_left_1}></div>
      <div className={styles.top_1}></div>
      <div className={styles.top_2}></div>
      <div className={styles.top_right_1}></div>
      <div className={styles.right_1}></div>
      <div className={styles.right_2}></div>
      <div className={styles.bottom_right_1}></div>
      <div className={styles.bottom_1}></div>
      <div className={styles.bottom_2}></div>
      <div className={styles.bottom_left_1}></div>
      <div className={styles.bottom_left_2}></div>
      <div className={styles.bottom_left_3}></div>
      <div className={styles.left_1}></div>

      <div className={styles.rect_1}></div>
      <div className={styles.rect_2}></div>
      <div className={styles.rect_3}></div>
      <div className={styles.rect_4}></div>
      <div className={styles.rect_5}></div>
    </div>
  );
}
