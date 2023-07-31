import styles from "@styles/common/header.module.scss";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.container}>
      <div className={styles.title_box} onClick={() => router.push("/")}>
        <h1 className={styles.title}>NodeNote</h1>
        <h4 className={styles.description}>知らない言葉と出会える辞書</h4>
      </div>
    </header>
  );
}
