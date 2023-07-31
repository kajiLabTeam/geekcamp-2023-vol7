import styles from "@/styles/components/dialog.module.scss";
import { useEffect, useState } from "react";
import markdownit from "markdown-it";

type Props = {
  isOpen: boolean;
  nodeId: number;
  nodeName: string;
};

export default function Dialog({ isOpen, nodeId, nodeName }: Props) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // fetch(`https://wisdom-tree-api.vercel.app/api/nodes/${nodeId}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setDescription(data.description);
    //   });
    const md =
      "## h1\nReact is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.";
    setDescription(md);

    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  }, [nodeId]);

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ""}`}>
      <div className={styles.top_left_1}></div>
      <div className={styles.top_left_2}></div>
      <div className={styles.top}></div>
      <div className={styles.top_right}></div>
      <div className={styles.right}></div>
      <div className={styles.right_2}></div>
      <div className={styles.bottom}></div>
      <div className={styles.bottom_2}></div>
      <div className={styles.left}></div>

      <div className={styles.inside_bottom}></div>
      <div className={styles.inside_left_1}></div>
      <div className={styles.inside_bottom_left}></div>
      <div className={styles.inside_left_2}></div>
      <div className={styles.inside_top_left}></div>
      <div className={styles.inside_top_1}></div>
      <div className={styles.inside_top_2}></div>
      <div className={styles.inside_top_right}></div>
      <div className={styles.inside_right}></div>

      <div className={styles.dialog}>
        <h1 className={styles.title}>{nodeName ?? "Not found."}</h1>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.box}>
              <svg viewBox="0 0 120 90">
                <g className={styles.main_cicle}>
                  <circle cx="41" cy="44" r="9" />
                  <circle className={styles.stroke} cx="41" cy="44" r="12" />
                </g>
                <g className={styles.left_bottom_circle}>
                  <circle cx="9" cy="80" r="9" />
                  <line
                    className={styles.stroke}
                    x1="9"
                    y1="80"
                    x2="32"
                    y2="52"
                  />
                </g>
                <g className={styles.right_top_circle}>
                  <circle cx="110" cy="6" r="6" />
                  <line
                    className={styles.stroke}
                    x1="82"
                    y1="46"
                    x2="110"
                    y2="6"
                  />
                </g>
                <g className={styles.right_circle}>
                  <circle cx="82" cy="46" r="8" />
                  <line
                    className={styles.stroke}
                    x1="53"
                    y1="44"
                    x2="82"
                    y2="46"
                  />
                </g>
                <g className={styles.top_circle}>
                  <circle cx="23" cy="15" r="5" />
                  <line
                    className={styles.stroke}
                    x1="22"
                    y1="15"
                    x2="34"
                    y2="34"
                  />
                </g>
              </svg>
            </div>
          </div>
        ) : (
          <div className={styles.description}>
            <p
              dangerouslySetInnerHTML={{
                __html: markdownit().render(description),
              }}
            ></p>
          </div>
        )}
      </div>
    </div>
  );
}