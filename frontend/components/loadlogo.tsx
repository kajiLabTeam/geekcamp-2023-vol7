import styles from "@/styles/components/load_logo.module.scss";

export default function LoadLogo() {
  return (
    <div className={styles.loading}>
      <div className={styles.box}>
        <svg viewBox="0 0 120 90">
          <g className={styles.main_cicle}>
            <circle cx="41" cy="44" r="9" />
            <circle className={styles.stroke} cx="41" cy="44" r="12" />
          </g>
          <g className={styles.left_bottom_circle}>
            <circle cx="9" cy="80" r="9" />
            <line className={styles.stroke} x1="9" y1="80" x2="32" y2="52" />
          </g>
          <g className={styles.right_top_circle}>
            <circle cx="110" cy="6" r="6" />
            <line className={styles.stroke} x1="82" y1="46" x2="110" y2="6" />
          </g>
          <g className={styles.right_circle}>
            <circle cx="82" cy="46" r="8" />
            <line className={styles.stroke} x1="53" y1="44" x2="82" y2="46" />
          </g>
          <g className={styles.top_circle}>
            <circle cx="23" cy="15" r="5" />
            <line className={styles.stroke} x1="22" y1="15" x2="34" y2="34" />
          </g>
        </svg>
      </div>
    </div>
  );
}
