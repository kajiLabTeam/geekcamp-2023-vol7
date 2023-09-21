import { ArticleObject } from "@/components/util/type";
import { atom } from "recoil";
import { recoilKeyHashSet } from "./keys";

export const currentNodeIdState = atom<number>({
  key: recoilKeyHashSet.currentNodeId,
  default: -1,
});

export const currentArticleState = atom<ArticleObject>({
  key: recoilKeyHashSet.currentArticle,
  default: {
    id: 0,
    nodeId: 0,
    lastUpdate: "2023.08.02",
    name: "wisdom Tree",
    article: "wisdom Tree は、知識をさらに広げるためのサービスです.",
  },
});

export const isDialogOpenState = atom<boolean>({
  key: recoilKeyHashSet.isDialogOpen,
  default: false,
});
