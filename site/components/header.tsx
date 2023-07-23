import styles from "@styles/common/header.module.scss";
import { MdiMagnify } from "@/components/icons";

export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.title_box}>
        <h1 className={styles.title}>NodeNote</h1>
        <h4 className={styles.description}>知らない言葉と出会える辞書</h4>
      </div>
      
      <div className={styles.search}>
        <MdiMagnify className={styles.icon} />
        <input type="text" name="search-node" id="search-node" />
      </div>
    </header>
  );
}
