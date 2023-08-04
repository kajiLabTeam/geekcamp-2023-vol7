import { atom } from "recoil";
import { recoilKeyHashSet } from "./keys";
import { ArticleObject, NodeObject } from "@/components/util/type";

export const currentNodeState = atom<NodeObject>({
  key: recoilKeyHashSet.currentNode,
  default: {
    id: 0,
    name: "wisdom Tree",
    articleId: 0,
    lastUpdate: "2023.08.02",
  },
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
