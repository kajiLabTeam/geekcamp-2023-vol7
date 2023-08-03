import { atom } from "recoil";
import { recoilKeyHashSet } from "./keys";
import { NodeObject } from "react-force-graph-2d";

export const currentNodeState = atom<NodeObject>({
  key: recoilKeyHashSet.currentNode,
  default: {
    id: 1,
    name: "wisdom Tree"
  }
});
