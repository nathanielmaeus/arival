import { rootStore } from "./index";
import { types, flow, Instance, getParent } from "mobx-state-tree";

import { IArticle } from "src/types";
import { IResponse, getApi } from "src/services/api";
import { DATA_STATE, ArticleModel, StatusModel } from "./types";

interface IData {
  response: {
    status: string;
    userTier: string;
    total: number;
    content: IArticle;
  };
}

type RootModel = Instance<typeof rootStore>;

export const ArticleStore = types
  .model({
    status: StatusModel,
    error: types.string,
    article: types.maybeNull(ArticleModel),
  })
  .views((self) => ({
    get statuses() {
      return {
        isLoading: self.status === DATA_STATE.loading,
        isLoaded: self.status === DATA_STATE.loaded,
        error: self.error,
      };
    },
  }))
  .actions((self) => {
    const getArticle = flow(function*(id: string) {
      self.status = DATA_STATE.loading;

      const { articles: articlesStore } = getParent<RootModel>(self);
      const selectedArticle = articlesStore.articles.find(
        (article) => article.id === id
      );

      if (selectedArticle) {
        self.article = { ...selectedArticle };
        self.status = DATA_STATE.loaded;
        return;
      }

      try {
        const {
          body: { response },
        }: IResponse<IData> = yield getApi({
          url: `https://content.guardianapis.com/${id}`,
        });

        self.article = response.content;
      } catch (e) {
        self.status = e.message;
        self.status = DATA_STATE.failed;
      }
      self.status = DATA_STATE.loaded;
    });

    return {
      getArticle,
    };
  });
