import { ArticleObject } from "@/components/util/type";
import { NodeObject } from "react-force-graph-2d";
import { atom } from "recoil";
import { nodesData } from "../testData";
import { recoilKeyHashSet } from "./keys";

export const currentNodeState = atom<NodeObject>({
  key: recoilKeyHashSet.currentNode,
  default: { ...nodesData[0] }
});

export const currentArticleState = atom<ArticleObject>({
  key: recoilKeyHashSet.currentArticle,
  default: {
    id: 0,
    nodeId: 0,
    lastUpdate: "2023.08.02",
    content: "wisdom Tree は、知識をさらに広げるためのサービスです.",
  },
});

export const isDialogOpenState = atom<boolean>({
  key: recoilKeyHashSet.isDialogOpen,
  default: false,
});
