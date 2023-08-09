import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditFrame from "@/components/editframe";
import LoadLogo from "@/components/loadlogo";
import styles from "@/styles/pages/edit.module.scss";
import markdownit from "markdown-it";
import { sanitize } from "dompurify";
import { fetchArticle } from "@/components/util/api";

export default function EditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [nodeName, setNodeName] = useState("");

  const router = useRouter();

  function markdown2html(md: string) {
    const mdit = markdownit();
    const sanitizedHtml = sanitize(mdit.render(md));
    return sanitizedHtml;
  }

  useEffect(() => {
    (async () => {
      const nodeId = Number(router.query.nodeId);
      if (Number.isNaN(nodeId)) return;

      const articleSnap = await fetchArticle(nodeId);
      setArticle(articleSnap.article);
      setNodeName("node name");
      setIsLoading(false);
    })();
  }, [setIsLoading, setArticle, router.query.nodeId]);

  useEffect(() => {
    const html = markdown2html(article);
    setMarkdown(html);
  }, [article]);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <LoadLogo />
      ) : (
        <>
          <EditFrame />
          <h1 className={styles.title}>{nodeName}</h1>
          <div className={styles.edit_container}>
            <div className={styles.edit_area_container}>
              <textarea
                className={styles.edit_area}
                defaultValue={article}
                onChange={(e) => setArticle(e.target.value)}
              ></textarea>
            </div>

            <div className={styles.preview_container}>
              <div
                className={styles.preview_area}
                dangerouslySetInnerHTML={{ __html: markdown }}
              ></div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
