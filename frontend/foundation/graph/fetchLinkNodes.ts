import { GraphData } from "./types";

export default async function fetchLinkNodes(currentId: number): Promise<GraphData> {
  // TODO: ちゃんとしたfetchに置き換える
  const length = Math.random() * 5 + 1 | 0;
  const nodes = Array.from({ length }, () => ({
    id: Math.random() * 1e10 | 0,
    name: (Math.random() * 1e3).toFixed(0),
    val: 10
  }));
  const links = nodes.map(({ id }) => ({
    source: currentId,
    target: id
  }));

  return { nodes, links };
}
