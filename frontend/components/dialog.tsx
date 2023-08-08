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
import { useRouter } from "next/router";
import LoadLogo from "./loadlogo";
import { sanitize } from "dompurify";

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

  const router = useRouter();

  // yyyy.mm.dd 形式にフォーマット
  function formatLastUpdate(lastUpdate: string) {
    const date = new Date(lastUpdate);
    const yyyy = date.getFullYear();
    const mm = ("0" + (1 + date.getMonth())).slice(-2);
    const dd = ("0" + date.getDate()).slice(-2);
    return `${yyyy}.${mm}.${dd}`;
  }

  function markdown2html(md: string) {
    const mdit = markdownit();
    const sanitizedHtml = sanitize(mdit.render(md));
    return sanitizedHtml;
  }

  function getArticle() {
    if (article.article === null) {
      return `### Not Found : ${currentNode?.name} は ${currentNode?.name} です`;
    } else {
      return article.article;
    }
  }

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
      if (articleSnap == null) {
        setArticle({
          id: 0,
          nodeId: 0,
          lastUpdate: "2023.08.02",
          article: "wisdom Tree は、知識をさらに広げるためのサービスです.",
        });
        setIsLoading(false);
        return;
      }
      setArticle(articleSnap);
      setIsLoading(false);
    })();
  }, [currentNode, setArticle]);

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
            <LoadLogo />
          ) : (
            <>
              <div className={styles.description}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: markdown2html(getArticle()),
                  }}
                ></div>
              </div>

              <p className={styles.last_update}>
                {formatLastUpdate(article.lastUpdate)}
                <svg
                  className={styles.edit_icon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  onClick={() => router.push(`/edit/${currentNode?.id}`)}
                >
                  <path
                    fill="currentColor"
                    d="M5 23.7q-.825 0-1.413-.587T3 21.7v-14q0-.825.588-1.413T5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.588 1.413T19 23.7H5Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-7.2 7.225H9v-4.25l7.175-7.175Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6t1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8l-2.475 2.475Z"
                  ></path>
                </svg>
              </p>
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
