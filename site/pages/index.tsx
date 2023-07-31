import Head from "next/head";
import styles from "@/styles/pages/home.module.scss";
import Canvas from "@/components/canvas";
import Frame from "@/components/frame";
import Dialog from "@/components/dialog";
import { useState } from "react";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeId, setNodeId] = useState(1);
  const [nodeName, setNodeName] = useState("React.js");

  return (
    <>
      <Head>
        <title>wisdom Tree</title>
        <meta
          name="description"
          content="wisdom Tree is a dictionary for searching unknown words."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={styles.main}
        onClick={() => setIsDialogOpen(!isDialogOpen)}
      >
        <Dialog
          isOpen={isDialogOpen}
          nodeId={nodeId}
          nodeName={nodeName}
        ></Dialog>
        <Frame></Frame>
        <Canvas></Canvas>
      </main>
    </>
  );
}
