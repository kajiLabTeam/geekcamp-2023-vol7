import { GraphData } from "./types";

export default function nodeAddLabel (graphData: GraphData): GraphData {
  const { nodes, links } = graphData;

  return {
    nodes: [...nodes, ...nodes.map(v => ({ id: `label_${v.id}`, label: "", val: 1 }))],
    links: [...links, ...nodes.map(v => ({ source: v.id, target: `label_${v.id}`, isLabel: true }))]
  }
}
