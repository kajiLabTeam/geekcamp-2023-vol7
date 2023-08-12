import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditFrame from "@/components/editframe";
import LoadLogo from "@/components/loadlogo";
import styles from "@/styles/pages/edit.module.scss";
import mdStyle from "@/styles/components/markdown.module.scss";
import markdownit from "markdown-it";
import { sanitize } from "dompurify";
import { fetchArticle, submitArticle } from "@/components/util/api";
import { ArticleObject } from "@/components/util/type";
import { auth } from "@/components/firebase/init";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import Image from "next/image";

export default function EditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<ArticleObject | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [state, setState] = useState("");
  const [isLogined, setIsLogined] = useState(false);
  const [articleBefore, setArticleBefore] = useState("");
  const [userInfo, setUserInfo] = useState({
    photoURL: "/images/person-outline.png",
    displayName: "",
    token: "",
  });

  const router = useRouter();
  const provider = new GoogleAuthProvider();

  async function submit() {
    if (!isLogined) {
      alert("ログインしてください.");
      return;
    }

    if (article?.article === articleBefore) {
      alert("更新する内容がありません.");
      return;
    }

    if (article !== null) {
      const res = await submitArticle(article.id, article.article);

      if (res.article === article.article) {
        alert("更新しました.");
        router.push("/");
      } else setState("更新に失敗しました.");
    } else {
      setState("nodeId がみつかりませんでした.");
    }
  }

  function changeArticle(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (article !== null) {
      setArticle({ ...article, article: e.target.value });
    }
  }

  function markdown2html(md: string | null) {
    if (md === null) return "";
    const mdit = markdownit();
    const sanitizedHtml = sanitize(mdit.render(md));
    return sanitizedHtml;
  }

  function clickUserIcon() {
    if (userInfo.displayName === "") {
      clickLogin();
    } else {
      clickLogout();
    }
  }

  function clickLogin() {
    signInWithRedirect(auth, provider);
  }

  async function clickLogout() {
    signOut(auth)
      .then(() => {
        const res = confirm("ログアウトしますか？");

        if (!res) return;

        setIsLogined(false);
        setUserInfo({
          photoURL: "/images/person-outline.png",
          displayName: "",
          token: "",
        });
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  }

  useEffect(() => {
    if (isLoading) return;

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken().then((token) => token);
        setUserInfo({
          photoURL: user.photoURL || "",
          displayName: user.displayName || "",
          token: token,
        });
        setIsLogined(true);
      } else {
        setIsLogined(false);
        alert("右上のアイコンからログインしてください.");
      }
    })();
  }, [setIsLoading, router.query.nodeId, isLoading]);

  useEffect(() => {
    (async () => {
      const nodeIdSnap = Number(router.query.nodeId);
      if (Number.isNaN(nodeIdSnap)) return;

      const articleSnap = await fetchArticle(nodeIdSnap).catch(() => null);

      if (articleSnap === null) {
        alert("記事が見つかりませんでした.");
        router.push("/");
      } else {
        setArticle(articleSnap);
        setArticleBefore(articleSnap.article);
        setIsLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    if (article === null) return;

    setState("");
    const html = markdown2html(article.article);
    setMarkdown(html);
  }, [article, isLogined]);

  return (
    <main className={styles.main}>
      {isLoading ? (
        <LoadLogo />
      ) : (
        <>
          <EditFrame />

          <Image
            className={styles.user_icon}
            src={userInfo.photoURL}
            alt="user icon"
            width={50}
            height={50}
            onClick={clickUserIcon}
          />

          <h1 className={styles.title}>
            {article == null ? "" : article?.name}
          </h1>
          <div className={styles.edit_container}>
            <div className={styles.scroll_box}>
              <div className={styles.edit_area_container}>
                <textarea
                  className={styles.edit_area}
                  defaultValue={article !== null ? article.article : ""}
                  onChange={changeArticle}
                  {...(isLogined ? {} : { disabled: true })}
                ></textarea>
              </div>

              <div className={styles.preview_container}>
                <div
                  className={`${styles.preview_area} ${mdStyle.markdown}`}
                  dangerouslySetInnerHTML={{ __html: markdown }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.button_container}>
            <span onClick={() => router.push("/")}>top</span>
            <p>{state}</p>
            <span onClick={submit}>submit</span>
          </div>
        </>
      )}
    </main>
  );
}
