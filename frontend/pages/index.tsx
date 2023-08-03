import Dialog from "@/components/dialog";
import Frame from "@/components/frame";
import { sleep } from "@/components/util";
import styles from "@/styles/pages/home.module.scss";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import Loading from "./loading";

const Canvas = dynamic(import('@/components/canvas'), {
  loading: () => <></>,
  ssr: false
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hideLoad, setHideLoad] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      setIsLoading(false);
      await sleep(1000);
      setHideLoad(true);
    }, 3000);
  }, []);

  return (
    <>
      <Head>
        <title>wisdom Tree</title>
        <meta
          name="description"
          content="wisdom Tree is a dictionary for searching unknown words."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <>
        {!hideLoad && <Loading isLoading={isLoading} />}
        <main
          className={styles.main}
        >
          <Dialog
            forceLoading={isLoading}
          />
          <Frame />
          <Canvas />
        </main>
      </>
    </>
  );
}
