import Frame from "@/components/frame";
import styles from "@styles/components/loading.module.scss";
import Image from "next/image";

export default function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    <main className={`${styles.load} ${isLoading ? "" : styles.loaded}`}>
      <Frame revColor={true} />
      <Image
        className={styles.logo}
        src={"/images/logo.png"}
        alt="logo"
        width={"600"}
        height={"400"}
      />
      <div className={styles.line_1}></div>
      <div className={styles.line_2}></div>
      <div className={styles.line_3}></div>
    </main>
  );
}
