import Dialog from "@/components/dialog";
import Frame from "@/components/frame";
import styles from "@/styles/pages/home.module.scss";
import dynamic from "next/dynamic";
import Head from "next/head";
import Search from "@/components/search";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { currentNodeIdState } from "@/const/recoil/state";

const Canvas = dynamic(import("@/components/canvas"), {
  loading: () => <></>,
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const currentNodeId = useRecoilValue(currentNodeIdState);

  useEffect(() => {
    setTimeout(async () => {
      if (currentNodeId === -1) {
        router.push("/search");
      } else {
        setIsLoading(false);
      }
    }, 1000);
  }, [currentNodeId, router]);

  return (
    <>
      <Head>
        <title>wisdom Tree</title>
        <meta
          name="description"
          content="wisdom Tree は知ってる単語から知らない単語を視覚的に見つけられるサービスです."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <>
        <Loading isLoading={isLoading} />
        <main className={styles.main}>
          <Dialog forceLoading={isLoading} />
          <Search />
          <Frame />
          {currentNodeId !== -1 && <Canvas />}
        </main>
      </>
    </>
  );
}
