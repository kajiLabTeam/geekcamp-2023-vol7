import styles from "@styles/common/top.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Technology } from "@components/type/type";
import { getTechs } from "@/components/model/api";
import { MdiMagnify } from "@/components/common/icons";

export default function Top() {
  const [search, setSearch] = useState<string>("");
  const [techs, setTechs] = useState<Technology[]>([]);
  const [filteredTechs, setFilteredTechs] = useState<Technology[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // const techsSnap: Technology[] = await getTechs();
      const techsSnap: Technology[] = [
        {
          id: "1",
          name: "React.js",
          parents: ["JavaScript", "TypeScript", "library"],
          children: ["Hooks", "Context", "Redux", "Router", "Form"],
        },
        {
          id: "2",
          name: "Next.js",
          parents: ["React.js", "SSG", "SSR", "ISR", "SPA"],
          children: ["Hooks", "Context", "Redux", "Router", "Form"],
        },
        {
          id: "3",
          name: "TypeScript",
          parents: ["JavaScript", "library"],
          children: ["React.js", "Next.js", "Node.js"],
        },
        {
          id: "4",
          name: "Sass",
          parents: ["CSS", "preprocessor"],
          children: [],
        },
        {
          id: "5",
          name: "Tailwind CSS",
          parents: ["CSS", "utility"],
          children: [],
        },
        {
          id: "6",
          name: "PostCSS",
          parents: ["CSS", "preprocessor"],
          children: [],
        },
        {
          id: "7",
          name: "ESLint",
          parents: ["JavaScript", "linter"],
          children: [],
        },
        {
          id: "8",
          name: "Prettier",
          parents: ["JavaScript", "formatter"],
          children: [],
        },
        {
          id: "9",
          name: "Jest",
          parents: ["JavaScript", "test"],
          children: [],
        },
        {
          id: "10",
          name: "React Testing Library",
          parents: ["JavaScript", "test"],
          children: [],
        },
        {
          id: "11",
          name: "GitHub Actions",
          parents: ["CI", "CD"],
          children: [],
        },
        { id: "12", name: "Vercel", parents: ["PaaS"], children: [] },
        { id: "13", name: "Google Fonts", parents: ["font"], children: [] },
        {
          id: "14",
          name: "Material Design Icons",
          parents: ["icon"],
          children: [],
        },
        {
          id: "15",
          name: "Favicon Generator",
          parents: ["icon"],
          children: [],
        },
        { id: "16", name: "PWA", parents: ["web", "app"], children: [] },
        { id: "17", name: "SEO", parents: ["web"], children: [] },
        { id: "18", name: "Open Graph", parents: ["web"], children: [] },
        {
          id: "19",
          name: "TypeDoc",
          parents: ["TypeScript", "documentation"],
          children: [],
        },
        {
          id: "20",
          name: "TypeScript ESLint",
          parents: ["TypeScript", "linter"],
          children: [],
        },
      ];
      setTechs(techsSnap);
      setFilteredTechs(techsSnap);
    })();
  }, []);

  function toTreePage(tech: Technology) {
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
        <input
          type="text"
          value={search}
          onChange={onChangeSearch}
        />
      </div>

      <main className={styles.main}>
        {filteredTechs.map((tech) => {
          return (
            <div
              key={tech.id}
              className={styles.box}
              onClick={() => toTreePage(tech)}
            >
              <div>{tech.name}</div>
            </div>
          );
        })}
      </main>
    </>
  );
}
