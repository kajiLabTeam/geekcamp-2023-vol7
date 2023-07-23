import styles from "@/styles/pages/tree.module.scss";
import drower from "@/styles/common/drower.module.scss";
import Canvas from "@/components/common/canvas";
import Header from "@/components/common/header";
import { getTechInfo } from "@/components/model/api";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Technology } from "@/components/type/type";
import markdownit from "markdown-it";
import {
  MaterialSymbolsArrowBackIosNewRounded,
  MaterialSymbolsEditSharp,
} from "@/components/common/icons";
import { getDayFromDatetime } from "@/components/util/util";

export default function Tree() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [techInfo, setTechInfo] = useState<Technology | null>({
    content: "React.js is a JavaScript library for building user interfaces.",
    id: 1,
    name: "React.js",
    lastUpdated: "2021-08-01T00:00:00.000Z",
  });

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") setIsOpen(!isOpen);
      if (e.key === "Escape") setIsOpen(false);
    });
  }, []);

  async function selectNode(nodeId: number) {
    const info = await getTechInfo(nodeId);

    setTechInfo(info);
    setIsOpen(true);
  }

  return (
    <>
      <Head>
        <title>NodeNote | Tree</title>
        <meta
          name="description"
          content="NodeNote is a dictionary for searching unknown words."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <h2 className={styles.btn} onClick={() => setIsOpen(!isOpen)}>
        btn
      </h2>

      <div className={`${drower.wrap} ${isOpen ? drower.open : ""}`}>
        <div className={drower.drower}>
          <MaterialSymbolsArrowBackIosNewRounded
            className={drower.arrow}
            onClick={() => setIsOpen(false)}
          />

          {techInfo !== null ? (
            <>
              <h1>{techInfo.name}</h1>

              <div
                className={drower.content}
                dangerouslySetInnerHTML={{
                  __html: markdownit().render(techInfo.content),
                }}
              />

              <div className={drower.drower_footer}>
                <MaterialSymbolsEditSharp className={drower.lastedit} />
                <p className={drower.last_updated}>
                  {getDayFromDatetime(techInfo.lastUpdated)}
                </p>
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>

        <div className={drower.overlay} onClick={() => setIsOpen(false)}></div>
      </div>

      <Canvas selectNode={selectNode} />
    </>
  );
}
