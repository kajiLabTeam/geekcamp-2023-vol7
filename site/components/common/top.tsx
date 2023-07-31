import styles from "@styles/pages/top.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Node } from "@components/type/type";
import { getTechs } from "@/components/model/api";
import { MdiMagnify } from "@/components/common/icons";

export default function Top() {
  const [search, setSearch] = useState<string>("");
  const [techs, setTechs] = useState<Node[]>([]);
  const [filteredTechs, setFilteredTechs] = useState<Node[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // const techsSnap: Node[] = await getTechs();
      const techsSnap: Node[] = [
        {
          id: 1,
          name: "React.js",
          parentIds: [0],
          childIds: [1],
          articleId: 2,
        },
        { id: 2, name: "Vue.js", parentIds: [0], childIds: [2], articleId: 2 },
        {
          id: 3,
          name: "Angular.js",
          parentIds: [0],
          childIds: [3],
          articleId: 2,
        },
        { id: 4, name: "Next.js", parentIds: [1], childIds: [4], articleId: 2 },
        { id: 5, name: "Nuxt.js", parentIds: [2], childIds: [5], articleId: 2 },
        {
          id: 6,
          name: "React Native",
          parentIds: [1],
          childIds: [6],
          articleId: 2,
        },
        { id: 7, name: "Flutter", parentIds: [0], childIds: [7], articleId: 2 },
        { id: 8, name: "Dart", parentIds: [7], childIds: [8], articleId: 2 },
        {
          id: 9,
          name: "TypeScript",
          parentIds: [0],
          childIds: [9],
          articleId: 2,
        },
        {
          id: 10,
          name: "JavaScript",
          parentIds: [0],
          childIds: [10],
          articleId: 2,
        },
        { id: 11, name: "HTML", parentIds: [0], childIds: [11], articleId: 2 },
        { id: 12, name: "CSS", parentIds: [0], childIds: [12], articleId: 2 },
        { id: 13, name: "Sass", parentIds: [12], childIds: [13], articleId: 2 },
        { id: 14, name: "Less", parentIds: [12], childIds: [14], articleId: 2 },
        {
          id: 15,
          name: "Stylus",
          parentIds: [12],
          childIds: [15],
          articleId: 2,
        },
        {
          id: 16,
          name: "Bootstrap",
          parentIds: [12],
          childIds: [16],
          articleId: 2,
        },
        {
          id: 17,
          name: "Tailwind CSS",
          parentIds: [12],
          childIds: [17],
          articleId: 2,
        },
        {
          id: 18,
          name: "Material UI",
          parentIds: [12],
          childIds: [18],
          articleId: 2,
        },
        {
          id: 19,
          name: "Bulma",
          parentIds: [12],
          childIds: [19],
          articleId: 2,
        },
        {
          id: 20,
          name: "Vuetify",
          parentIds: [12],
          childIds: [20],
          articleId: 2,
        },
        {
          id: 21,
          name: "Quasar",
          parentIds: [12],
          childIds: [21],
          articleId: 2,
        },
        {
          id: 22,
          name: "Chakra UI",
          parentIds: [12],
          childIds: [22],
          articleId: 2,
        },
        {
          id: 23,
          name: "React Bootstrap",
          parentIds: [12],
          childIds: [23],
          articleId: 2,
        },
        {
          id: 24,
          name: "Reactstrap",
          parentIds: [12],
          childIds: [24],
          articleId: 2,
        },
        {
          id: 25,
          name: "Ant Design",
          parentIds: [12],
          childIds: [25],
          articleId: 2,
        },
        {
          id: 26,
          name: "PrimeReact",
          parentIds: [12],
          childIds: [26],
          articleId: 2,
        },
        {
          id: 27,
          name: "Onsen UI",
          parentIds: [12],
          childIds: [27],
          articleId: 2,
        },
        {
          id: 28,
          name: "Ionic",
          parentIds: [12],
          childIds: [28],
          articleId: 2,
        },
        {
          id: 29,
          name: "Framework7",
          parentIds: [12],
          childIds: [29],
          articleId: 2,
        },
        {
          id: 30,
          name: "Buefy",
          parentIds: [12],
          childIds: [30],
          articleId: 2,
        },
      ];
      setTechs(techsSnap);
      setFilteredTechs(techsSnap);
    })();
  }, []);

  function toTreePage(tech: Node) {
    router.push("/tree");
  }

  function onChangeSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setSearch(text);

    // techs.name に text が含まれるものを取り出す. ただし大文字小文字は区別しない
    const filteredTechs = techs.filter((tech) => {
      return tech.name.toLowerCase().includes(text.toLowerCase());
    });

    if (text === "") setFilteredTechs(techs);
    else setFilteredTechs(filteredTechs);
  }
  return (
    <>
      <div className={styles.search}>
        <MdiMagnify className={styles.icon} />
        <input type="text" value={search} onChange={onChangeSearch} />
      </div>

      <main className={styles.main}>
        {filteredTechs.map((tech) => {
          return (
            <div
              key={tech.id}
              className={styles.bo}
              onClick={() => toTreePage(tech)}
            >
              <div className={styles.box}>
              <div>{tech.name}</div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}
