import { Instance } from "mobx-state-tree";
import { ArticleModel } from "src/store/headlines";

export type IArticle = Instance<typeof ArticleModel>;

export type ICategory =
  | "business"
  | "sports"
  | "entertainment"
  | "general"
  | "health"
  | "science"
  | "technology";

export interface IIconProps {
  w?: number;
  h?: number;
  className?: string;
  onClick?: () => void;
}
