import { Link, Node } from "@/foundation/graph/types";

export const nodesData: Node[] = [
  {
    id: "reactjs",
    name: "React.js",
    isOpened: true,
    val: 10
  },
  {
    id: "liblary",
    name: "ライブラリ",
    val: 2
  },
  {
    id: "framework",
    name: "フレームワーク",
    val: 1
  },
  {
    id: "JavaScript",
    name: "JavaScript",
    val: 2
  },
  {
    id: "hooks",
    name: "hooks",
    isOpened: true,
    val: 1
  },
  {
    id: "useRef",
    name: "useRef",
    val: 1
  },
  {
    id: "useState",
    name: "useState",
    val: 1
  },
  {
    id: "useEffect",
    name: "useEffect",
    val: 1
  },
  {
    id: "empty_0",
    name: "",
    val: 1
  },
  {
    id: "empty_1",
    name: "",
    val: 1
  },
]

export const linksData: Link[] = [
  {
    source: "reactjs",
    target: "liblary",
  },
  {
    source: "reactjs",
    target: "framework",
  },
  {
    source: "reactjs",
    target: "JavaScript",
  },
  {
    source: "reactjs",
    target: "hooks",
  },
  {
    source: "reactjs",
    target: "JavaScript",
  },
  {
    source: "reactjs",
    target: "empty_0",
  },
  {
    source: "reactjs",
    target: "empty_1",
  },
  {
    source: "hooks",
    target: "useState",
  },
  {
    source: "hooks",
    target: "useRef",
  },
  {
    source: "hooks",
    target: "useEffect",
  },
]
