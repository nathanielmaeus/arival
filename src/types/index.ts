import { Instance } from "mobx-state-tree";
import { ArticleModel } from "src/store/types";

export type IArticle = Instance<typeof ArticleModel>;
