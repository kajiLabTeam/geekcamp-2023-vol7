import styles from "@/styles/components/dialog.module.scss";
import mdStyle from "@/styles/components/markdown.module.scss";
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
import Link from "next/link";

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
    });
  }, [setIsDialogOpen]);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      if (currentNode?.id === undefined) return;

      const articleSnap = await fetchArticle(currentNode?.id as number).catch(
        () => null
      );

      if (articleSnap == null) {
        setArticle({
          id: -1,
          nodeId: currentNode.id,
          name: currentNode.name || "Not Found",
          lastUpdate: "2023.08.11",
          article: "記事はありません.",
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
            <div className={styles.load_container}>
              <LoadLogo />
            </div>
          ) : (
            <>
              <div className={styles.description}>
                <div
                  className={mdStyle.markdown}
                  dangerouslySetInnerHTML={{
                    __html: markdown2html(getArticle()),
                  }}
                ></div>
              </div>

              <p className={styles.last_update}>
                {formatLastUpdate(article.lastUpdate)}

                <Link href={`https://www.google.com/search?q=${article.name}`}>
                  <svg
                    className={styles.google_icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 489.62 501.01"
                    onClick={() => {
                      router.push(`/search/${currentNode?.name}`);
                    }}
                  >
                    <path d="M25.92,139.43c15.5-32.3,37.4-59.6,65-82.3C128.32,26.23,171.22,7.63,219.32,1.93c56.5-6.7,109.6,4,158.7,33.4,12.2,7.3,23.6,15.6,34.5,24.6,2.7,2.2,2.4,3.5,.1,5.7-22.3,22.2-44.6,44.4-66.7,66.8-2.6,2.6-4,2.4-6.8,.3-64.8-49.9-159.3-36.4-207.6,29.6-8.5,11.6-15.4,24.1-20.2,37.7-.4,1.2-1.2,2.3-1.8,3.5-12.9-9.8-25.9-19.6-38.7-29.5-15-11.5-30-23-44.9-34.6Z" />
                    <path d="M109.52,297.33c4.3,9.5,7.9,19.4,13.3,28.3,22.7,37.2,55.1,61.1,97.8,69.6,38.5,7.7,75.5,2.5,110-16.8,1.2-.6,2.4-1.2,3.5-1.8,.6,.6,1.1,1.3,1.7,1.8,25.8,20,51.7,40,77.5,60-12.4,12.3-26.5,22.2-41.5,30.8-43.5,24.8-90.6,34.8-140.2,31-61.8-4.8-115.1-29.2-159.1-73.2-19.3-19.3-35.2-41.1-46.7-66,10.7-8.2,21.4-16.3,32.1-24.5,17.2-13.1,34.4-26.1,51.6-39.2Z" />
                    <path d="M413.42,438.43c-25.8-20-51.7-40-77.5-60-.6-.5-1.2-1.2-1.7-1.8,8.9-6.9,18-13.6,25.3-22.4,12.2-14.6,20.3-31.1,24.5-49.6,.5-2.3,.1-3.1-2.2-3-1.2,.1-2.3,0-3.5,0-40.8,0-81.7-.1-122.5,.1-4.5,0-5.5-1.2-5.4-5.5,.2-29,.2-58,0-87,0-3.7,1-4.7,4.7-4.7,74.8,.1,149.6,.1,224.5,0,3.2,0,4.5,.8,5.3,4.2,6.1,27.5,5.7,55.1,2,82.9-3,22.2-8.4,43.7-16.7,64.5-12.3,30.7-30.4,57.5-54.2,80.5-.9,.7-1.8,1.2-2.6,1.8Z" />
                    <path d="M109.52,297.33c-17.2,13.1-34.4,26.1-51.6,39.2-10.7,8.1-21.4,16.3-32.1,24.5-8.3-15.4-13.7-31.7-18.1-48.5C-.68,280.03-1.98,247.03,2.62,213.93c3.6-26,11.1-51,23.2-74.4,15,11.5,29.9,23.1,44.9,34.6,12.9,9.9,25.8,19.7,38.7,29.5-2.2,10.7-5.3,21.2-6.3,32.2-1.8,20,.1,39.5,5.8,58.7,.4,.8,.5,1.8,.6,2.8Z" />
                  </svg>
                </Link>

                <Link href={`https://qiita.com/search?q=tag:${article.name}`}>
                  <svg
                    className={styles.qiita_icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                  >
                    <path d="M222.77,227.36c-16.18,17.26-38.17,22.94-64.78,25.63-53.89,5.45-100.57-18.62-106.22-78.74-2.4-25.56,3.29-49.86,14.76-69.77l-6.68-26.26c-1.08-4.56,3.12-8.91,7.57-7.83l23.07,5.6c13.72-11.26,30.31-18.62,48.62-20.48,15.66-1.58,30.84,1.04,44.64,7.03l21.68-13.12c4.08-2.47,9.25,.32,9.64,5.2l1.25,30.94h0c16.68,17.61,28.03,41.65,30.6,68.95,1.45,15.42-.15,27.22-4.24,38.47-1.91,5.27-2.49,9.72,.97,14.13,3.34,4.26,8.64,12.53,14.55,11.14,8.88-2.08,18.4-1.53,24.28,2.14,11.18-20.99,17.53-44.96,17.53-70.4C300,67.16,232.84,0,150,0S0,67.16,0,150s67.16,150,150,150c42.48,0,80.83-17.66,108.12-46.04-4.79-.72-9.68-2.58-14.33-5.68-8.93-5.95-16.86-11.58-21.02-20.92Z" />
                    <path d="M208.92,117.38l14.01-1.72-.2-2.52-14.37,1.76c-.62-1.82-1.31-3.59-2.08-5.32l15.83-5.05-.5-3.17-16.84,5.83c-11.3-23.68-35.72-38.06-63.37-35.26-27.6,2.79-49.46,22.67-56.17,48.11l-16.47-2.49-.18,3.24,16.22,1.76c-.44,1.87-.8,2.98-1.07,4.9l-14.15,1.13,.13,2.53,13.79-1.1c-.24,2.14-.39,3.52-.42,5.71l-12.6,5.15,.62,3.12,12-5.61c.03,1.67,.1,2.57,.26,4.26,3.33,35.46,32.96,42.48,68.35,38.9,35.39-3.58,63.15-16.39,59.81-51.86-.16-1.7-.4-2.59-.69-4.24l13,2.82,.3-2.86-13.63-2.59c-.43-2.11-.96-3.39-1.58-5.41Z" />
                  </svg>
                </Link>

                {article.id !== -1 && (
                  <svg
                    className={styles.edit_icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    onClick={() => router.push(`/edit/${currentNode?.id}`)}
                    data-tip="編集"
                  >
                    <path
                      fill="currentColor"
                      d="M5 23.7q-.825 0-1.413-.587T3 21.7v-14q0-.825.588-1.413T5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.588 1.413T19 23.7H5Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-7.2 7.225H9v-4.25l7.175-7.175Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6t1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8l-2.475 2.475Z"
                    ></path>
                  </svg>
                )}
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
