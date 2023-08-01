import Head from "next/head";
import styles from "@/styles/pages/home.module.scss";
import Canvas from "@/components/canvas";
import Frame from "@/components/frame";
import Dialog from "@/components/dialog";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { sleep } from "@/components/util";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hideLoad, setHideLoad] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeId, setNodeId] = useState(1);
  const [nodeName, setNodeName] = useState("wisdom Tree");

  useEffect(() => {
    setTimeout(async () => {
      setIsLoading(false);
      await sleep(1000);
      setHideLoad(true);
    }, 1000);
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
          onClick={() => setIsDialogOpen(!isDialogOpen)}
        >
          <Dialog
            isOpen={isDialogOpen}
            nodeId={nodeId}
            nodeName={nodeName}
            forceLoading={isLoading}
          ></Dialog>
          <Frame />
          <Canvas />
        </main>
      </>
    </>
  );
}
