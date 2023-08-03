import { LinkObject, NodeObject } from "react-force-graph-2d";

const PRIMARY = "#000000";
const ACCENT = "#75BEC2"

export type Node = NodeObject<{
  id: string;
  name?: string;
  nodeLabel?: string;
  color?: string;
  val: number;
}>

export type Link = LinkObject<Node>

export const nodesData: Node[] = [
  {
    id: "reactjs",
    name: "React.js",
    nodeLabel: "React.js",
    color: PRIMARY,
    val: 10
  },
  {
    id: "liblary",
    name: "ライブラリ",
    nodeLabel: "ライブラリ",
    color: PRIMARY,
    val: 2
  },
  {
    id: "framework",
    name: "フレームワーク",
    nodeLabel: "フレームワーク",
    color: PRIMARY,
    val: 1
  },
  {
    id: "JavaScript",
    name: "JavaScript",
    nodeLabel: "JavaScript",
    color: PRIMARY,
    val: 2
  },
  {
    id: "hooks",
    name: "hooks",
    nodeLabel: "hooks",
    color: ACCENT,
    val: 1
  },
  {
    id: "useRef",
    name: "useRef",
    nodeLabel: "useRef",
    color: ACCENT,
    val: 1
  },
  {
    id: "useState",
    name: "useState",
    nodeLabel: "useState",
    color: PRIMARY,
    val: 1
  },
  {
    id: "useEffect",
    name: "useEffect",
    nodeLabel: "useEffect",
    color: PRIMARY,
    val: 1
  },
  {
    id: "empty_0",
    name: "",
    nodeLabel: "",
    color: ACCENT,
    val: 1
  },
  {
    id: "empty_1",
    name: "",
    nodeLabel: "",
    color: ACCENT,
    val: 1
  },
]

export const linksData: Link[] = [
  {
    source: "reactjs",
    target: "liblary",
    color: PRIMARY
  },
  {
    source: "reactjs",
    target: "framework",
    color: PRIMARY
  },
  {
    source: "reactjs",
    target: "JavaScript",
    color: PRIMARY
  },
  {
    source: "reactjs",
    target: "hooks",
    color: PRIMARY
  },
  {
    source: "reactjs",
    target: "JavaScript",
    color: PRIMARY
  },
  {
    source: "reactjs",
    target: "empty_0",
    color: ACCENT
  },
  {
    source: "reactjs",
    target: "empty_1",
    color: ACCENT
  },
  {
    source: "hooks",
    target: "useState",
    color: ACCENT
  },
  {
    source: "hooks",
    target: "useRef",
    color: PRIMARY
  },
  {
    source: "hooks",
    target: "useEffect",
    color: PRIMARY
  },
]
