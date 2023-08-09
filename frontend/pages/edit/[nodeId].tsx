import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditFrame from "@/components/editframe";
import LoadLogo from "@/components/loadlogo";
import styles from "@/styles/pages/edit.module.scss";
import markdownit from "markdown-it";
import { sanitize } from "dompurify";
import { fetchArticle, submitArticle } from "@/components/util/api";
import { ArticleObject } from "@/components/util/type";
import { auth } from "@/components/firebase/init";
import {
  GoogleAuthProvider,
  getRedirectResult,
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
  const [userInfo, setUserInfo] = useState({
    photoURL: "/images/person-outline.png",
    displayName: "",
  });

  const router = useRouter();
  const provider = new GoogleAuthProvider();

  async function submit() {
    if (article !== null) {
      const res = await submitArticle(article.id, article.article);

      if (res.article === article.article) setState("更新しました。");
      else setState("更新に失敗しました。");
    } else {
      setState("nodeId がみつかりませんでした。");
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
        console.log("ログアウトしました");
        setUserInfo({
          photoURL: "/images/person-outline.png",
          displayName: "",
        });
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
  }

  async function checkLogin() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          photoURL: user.photoURL || "",
          displayName: user.displayName || "",
        });
      }
    });
  }

  useEffect(() => {
    (async () => {
      const nodeIdSnap = Number(router.query.nodeId);
      if (Number.isNaN(nodeIdSnap)) return;

      const articleSnap = await fetchArticle(nodeIdSnap);
      setArticle(articleSnap);
      setIsLoading(false);
    })();
  }, [setIsLoading, setArticle, router.query.nodeId]);

  useEffect(() => {
    if (article === null) return;

    setState("");
    const html = markdown2html(article.article);
    setMarkdown(html);
  }, [article]);

  useEffect(() => {
    checkLogin();

    getRedirectResult(auth)
      .then((result) => {
        if (result === null) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        const token = credential.accessToken;
        console.log(token);
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        console.error(errorCode);
        console.error(errorMessage);
        console.error(email);
      });
  }, []);

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
                ></textarea>
              </div>

              <div className={styles.preview_container}>
                <div
                  className={styles.preview_area}
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
