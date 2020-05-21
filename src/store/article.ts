import { types, flow, cast } from "mobx-state-tree";

import { IArticle } from "src/types";
import { IResponse, getApi } from "src/services/api";
import { DATA_STATE } from "./types";

interface IData {
  response: {
    status: string;
    userTier: string;
    total: number;
    content: IArticle;
  };
}

export const ArticleModel = types.model({
  id: types.string,
  type: types.string,
  sectionId: types.string,
  sectionName: types.string,
  webPublicationDate: types.string,
  webTitle: types.string,
  webUrl: types.string,
  apiUrl: types.string,
  isHosted: types.boolean,
  pillarId: types.string,
  pillarName: types.string,
});

export const ArticleStore = types
  .model({
    status: types.enumeration("State", [
      "initial",
      "loading",
      "loaded",
      "failed",
    ]),
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

      try {
        const { body }: IResponse<IData> = yield getApi({
          url: `https://content.guardianapis.com/${id}?api-key=91d2be46-870f-46ca-9378-36090d49caea`,
        });

        self.article = body.response.content;
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
