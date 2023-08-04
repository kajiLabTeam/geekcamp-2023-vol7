import { GraphData } from "./types";

export default function nodeAddLabel (graphData: GraphData): GraphData {
  const { nodes, links } = graphData;

  return {
    nodes: [...nodes, ...nodes.map(v => ({ id: -v.id, val: 1 }))],
    links: [...links, ...nodes.map(v => ({ source: v.id, target: -v.id, isLabel: true }))]
  }
}
