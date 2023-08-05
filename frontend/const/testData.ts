import { Link, Node } from "@/foundation/graph/types";

export const nodesData: Node[] = [
  {
    id: 1,
    name: "wisdom Tree",
    isOpened: true,
    isCurrent: true,
    val: 10
  },
  {
    id: 2,
    name: "フロントエンド",
    val: 10
  },
  {
    id: 3,
    name: "バックエンド",
    val: 10
  },
]

export const linksData: Link[] = [
  {
    source: 1,
    target: 2
  },
  {
    source: 1,
    target: 3
  }
]
