import Frame from "@/components/frame";
import styles from "@styles/pages/loading.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loading({ isLoading }: { isLoading: boolean }) {
  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsHide(true);
      }, 1000);
    }
  }, [isLoading]);

  return (
    <>
      {isHide || (
        <div className={`${styles.load} ${isLoading ? "" : styles.loaded}`}>
          <Frame revColor={true} />
          <Image
            className={styles.logo}
            src={"/images/logo.png"}
            alt={"logo"}
            width={"600"}
            height={"400"}
            priority={true}
          />
          <Image
            className={styles.kirakira_top}
            src={"/images/kirakira_top.svg"}
            alt={"kirakira"}
            width={"600"}
            height={"400"}
          />
          <Image
            className={styles.kirakira_bottom}
            src={"/images/kirakira_bottom.svg"}
            alt={"kirakira"}
            width={"600"}
            height={"400"}
          />
          <div className={styles.line_1}></div>
          <div className={styles.line_2}></div>
          <div className={styles.line_3}></div>
        </div>
      )}
    </>
  );
}
