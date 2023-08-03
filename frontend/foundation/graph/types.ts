import { NodeObject, LinkObject } from "react-force-graph-2d";

export type Node = NodeObject<{
  id: string;
  name?: string;
  nodeLabel?: string;
  color?: string;
  val: number;
}>

export type Link = LinkObject<Node>

export type GraphData = {
  nodes: Node[],
  links: Link[]
}
