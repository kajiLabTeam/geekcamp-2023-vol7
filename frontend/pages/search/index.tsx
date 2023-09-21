import styles from "@/styles/pages/search.module.scss";
import Frame from "@/components/frame";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [_, setIsFirst] = useLocalStorage({
    key: "isFirst",
    defaultValue: true,
  });

  useEffect(() => {
    setIsFirst(false);
  }, [setIsFirst]);

  function search() {
    console.log(searchValue);
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
        <p className={styles.search_title}>始まりのノードを探してみましょう</p>
      </div>
      <Frame revColor={true} />
    </main>
  );
}
