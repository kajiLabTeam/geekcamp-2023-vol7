import { NodeObject, LinkObject } from "react-force-graph-2d";

export type Node = NodeObject<{
  id: number;
  val: number;
  connectNum: number;
  name?: string;
}>

export type Link = LinkObject<Node>

export type GraphData = {
  nodes: Node[],
  links: Link[]
}
