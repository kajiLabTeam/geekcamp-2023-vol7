import styles from "@/styles/components/dialog.module.scss";
import { useEffect, useState } from "react";
import markdownit from "markdown-it";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentArticleState,
  currentNodeIdState,
  isDialogOpenState,
} from "@/const/recoil/state";
import { fetchArticle } from "@/components/util/api";
import useGraphData from "@/hooks/useGraphData";

type Props = {
  forceLoading: boolean;
};

export default function Dialog(
  { forceLoading }: Props = {
    forceLoading: false,
  }
) {
  const [isDialogOpen, setIsDialogOpen] = useRecoilState(isDialogOpenState);
  const { getNode } = useGraphData();
  const currentNodeId = useRecoilValue(currentNodeIdState);
  const currentNode = getNode(currentNodeId);
  const [article, setArticle] = useRecoilState(currentArticleState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Escape") setIsDialogOpen(false);
      else if (e.code === "Space") setIsDialogOpen((v) => !v);
    });
  }, [setIsDialogOpen]);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      if (!currentNode?.id) return;

      const articleSnap = await fetchArticle(currentNode?.id as number);
      setArticle(articleSnap);
      setIsLoading(false);
    })();
  }, [currentNode]);

  return (
    <>
      <div
        className={`${styles.wrapper} ${isDialogOpen ? styles.open : ""}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className={styles.top_left_1}></div>
        <div className={styles.top_left_2}></div>
        <div className={styles.top}></div>
        <div className={styles.top_right}></div>
        <div className={styles.right}></div>
        <div className={styles.right_2}></div>
        <div className={styles.bottom}></div>
        <div className={styles.bottom_2}></div>
        <div className={styles.left}></div>

        <div className={`${styles.inside} ${styles.inside_bottom}`}></div>
        <div className={`${styles.inside} ${styles.inside_left_1}`}></div>
        <div className={`${styles.inside} ${styles.inside_bottom_left}`}></div>
        <div className={`${styles.inside} ${styles.inside_left_2}`}></div>
        <div className={`${styles.inside} ${styles.inside_top_left}`}></div>
        <div className={`${styles.inside} ${styles.inside_top_1}`}></div>
        <div className={`${styles.inside} ${styles.inside_top_2}`}></div>
        <div className={`${styles.inside} ${styles.inside_top_right}`}></div>
        <div className={`${styles.inside} ${styles.inside_right}`}></div>

        <div className={styles.dialog}>
          <h1 className={styles.title}>{currentNode?.name}</h1>
          <div className={styles.subtitle}>{currentNode?.name}</div>

          {isLoading || forceLoading ? (
            <div className={styles.loading}>
              <div className={styles.box}>
                <svg viewBox="0 0 120 90">
                  <g className={styles.main_cicle}>
                    <circle cx="41" cy="44" r="9" />
                    <circle className={styles.stroke} cx="41" cy="44" r="12" />
                  </g>
                  <g className={styles.left_bottom_circle}>
                    <circle cx="9" cy="80" r="9" />
                    <line
                      className={styles.stroke}
                      x1="9"
                      y1="80"
                      x2="32"
                      y2="52"
                    />
                  </g>
                  <g className={styles.right_top_circle}>
                    <circle cx="110" cy="6" r="6" />
                    <line
                      className={styles.stroke}
                      x1="82"
                      y1="46"
                      x2="110"
                      y2="6"
                    />
                  </g>
                  <g className={styles.right_circle}>
                    <circle cx="82" cy="46" r="8" />
                    <line
                      className={styles.stroke}
                      x1="53"
                      y1="44"
                      x2="82"
                      y2="46"
                    />
                  </g>
                  <g className={styles.top_circle}>
                    <circle cx="23" cy="15" r="5" />
                    <line
                      className={styles.stroke}
                      x1="22"
                      y1="15"
                      x2="34"
                      y2="34"
                    />
                  </g>
                </svg>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.description}>{article.article}</div>
              <p className={styles.last_update}>{article.lastUpdate}</p>
            </>
          )}
        </div>
      </div>

      <div
        className={`${styles.bg} ${isDialogOpen ? styles.open : ""}`}
        onClick={() => setIsDialogOpen(false)}
      ></div>
    </>
  );
}
