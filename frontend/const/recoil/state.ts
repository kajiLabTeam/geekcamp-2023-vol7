import { atom } from "recoil";
import { recoilKeyHashSet } from "./keys";
import { NodeObject } from "react-force-graph-2d";
import { nodesData } from "../testData";

export const currentNodeState = atom<NodeObject>({
  key: recoilKeyHashSet.currentNode,
  default: { ...nodesData[0] }
});

export const isDialogOpenState = atom<boolean>({
  key: recoilKeyHashSet.isDialogOpen,
  default: false
})
