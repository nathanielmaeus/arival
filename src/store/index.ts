import { ArticlesStore } from "src/store/headlines";
import { types, Instance, onSnapshot } from "mobx-state-tree";
import { createContext, useContext } from "react";
import { ArticleStore } from "./article";

const RootModel = types.model({
  articles: ArticlesStore,
  article: ArticleStore,
});

export const rootStore = RootModel.create({
  articles: {
    articles: [],
    status: "initial",
    error: "",
    form: {
      fields: {
        headline: "",
        sourceMedia: "",
        text: "",
        url: "",
        author: "",
      },
      step: 0,
    },
    page: 0,
  },
  article: {
    article: null,
    status: "initial",
    error: "",
  },
});

onSnapshot(rootStore, (snapshot) => console.log("Snapshot: ", snapshot));

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const Provider = RootStoreContext.Provider;

export function useStore() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
