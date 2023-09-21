import styles from "@/styles/pages/search.module.scss";
import Frame from "@/components/frame";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSearchWord } from "@/components/util/api";
import { currentArticleState, currentNodeIdState } from "@/const/recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { NodeObject } from "@/components/util/type";
import { useRouter } from "next/router";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const setCurrentId = useSetRecoilState(currentNodeIdState);
  const [suggestions, setSuggestions] = useState<NodeObject[]>([]);
  const [isFirst, setIsFirst] = useLocalStorage({
    key: "isFirst",
    defaultValue: true,
  });

  const router = useRouter();

  useEffect(() => {
    setIsFirst(false);
  }, [setIsFirst]);

  function jumpToNode(nodeId: number) {
    setCurrentId(nodeId);
    router.push("/");
  }

  async function search() {
    console.log(searchValue);
    if (searchValue === "") return;
    const res = await fetchSearchWord(searchValue).catch(() => null);

    if (!res) return;
    if (res.type === "node") {
      jumpToNode(res.currentNode.id);
    } else {
      setSuggestions(res.suggestions);
    }
  }

  return (
    <main className={styles.search}>
      <div className={styles.search_box}>
        <div className={styles.image_wrapper}>
          <Image
            className={styles.logo}
            src={"/images/logo.png"}
            alt={"logo"}
            width={"500"}
            height={"400"}
            priority={true}
          />
        </div>
        <input
          type="text"
          className={styles.search_input}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
        />
        {suggestions ? (
          <div className={styles.suggestion}>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => {
                  jumpToNode(suggestion.id);
                }}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.search_title}>
            始まりのノードを探してみましょう
          </p>
        )}
      </div>
      <Frame revColor={true} />
    </main>
  );
}
