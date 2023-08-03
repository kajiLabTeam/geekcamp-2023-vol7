import Head from "next/head";
import styles from "@/styles/pages/home.module.scss";
import Frame from "@/components/frame";
import Dialog from "@/components/dialog";
import { useCallback, useEffect, useState } from "react";
import Loading from "./loading";
import { sleep } from "@/components/util";
import dynamic from "next/dynamic";

const Canvas = dynamic(import('@/components/canvas'), {
  loading: () => <></>,
  ssr: false
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hideLoad, setHideLoad] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      setIsLoading(false);
      await sleep(1000);
      setHideLoad(true);
    }, 3000);
  }, []);

  const openDirlog = useCallback(() => setIsDialogOpen(true), []);
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
            isOpen={isDialogOpen}
            forceLoading={isLoading}
            onClick={() => setIsDialogOpen(!isDialogOpen)}
          />
          <Frame />
          <Canvas
            openDirlog={openDirlog}
          />
        </main>
      </>
    </>
  );
}
