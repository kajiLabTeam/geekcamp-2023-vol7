import styles from "@/styles/components/search.module.scss";
import { useEffect, useState } from "react";
import { fetchNodeConnect, fetchSearchWord } from "@/components/util/api";
import { NodeObject } from "@/components/util/type";
import useGraphData from "@/hooks/useGraphData";
import { useSetRecoilState } from "recoil";
import { currentNodeIdState } from "@/const/recoil/state";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [suggestions, setSuggestions] = useState<NodeObject[]>([]);
  const setCurrentId = useSetRecoilState(currentNodeIdState);
  const { addConnection } = useGraphData();

  async function nodeId2NodeConnection(nodeId: number) {
    const res = await fetchNodeConnect(nodeId);
    const currentNode = addConnection(res);
    setCurrentId(currentNode.id);
  }

  async function search(word: string) {
    if (word === "") return;
    const res = await fetchSearchWord(word).catch(() => null);

    if (!res) return;

    if (res.type === "node") {
      const currentNode = addConnection(res);
      setCurrentId(currentNode.id);
    } else {
      setSuggestions(res.suggestions);
    }
  }

  useEffect(() => {
    if (!isOpen) setSuggestions([]);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "f") {
        setIsOpen(true);
      }
    });
  }, [setIsOpen]);

  return (
    <>
      <div className={`${styles.search} ${isOpen ? "" : styles.open}`}>
        <div className={styles.arrow_box} onClick={() => setIsOpen((v) => !v)}>
          <svg
            className={styles.arrow}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z" />
          </svg>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
          viewBox="0 0 512 512"
          onClick={() => {
            setIsOpen(true);
            if (isOpen) search(searchWord);
          }}
        >
          <path
            d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit="10"
            strokeWidth="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M338.29 338.29L448 448"
          />
        </svg>

        <input
          type="text"
          className={styles.input}
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search(searchWord);
          }}
          placeholder={"Search"}
        />

        <div className={styles.suggestion}>
          {suggestions.map((suggestion) => (
            <div
              className={styles.suggestionItem}
              key={suggestion.id}
              onClick={() => {
                setIsOpen(false);
                nodeId2NodeConnection(suggestion.id);
              }}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
