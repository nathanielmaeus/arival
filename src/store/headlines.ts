import { types, flow, cast } from "mobx-state-tree";

import { IArticle } from "src/types";
import { IResponse, getApi } from "src/services/api";
import { IDataForm } from "src/components/organisms/form/source-form";

import { DATA_STATE, ArticleModel, StatusModel } from "./types";

interface IData {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: IArticle[];
  };
}

export interface IParams {
  pageSize?: number;
  page?: number;
}

const MAX_PAGE = 5;

export const SourceType = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

export const FormModel = types.model({
  fields: types.model({
    sourceMedia: types.string,
    headline: types.string,
    text: types.string,
    url: types.string,
    author: types.string,
  }),
  step: types.number,
});

function prepareDataForArticle(dataForm: IDataForm, id: number) {
  const { url, author, headline } = dataForm;
  const webPublicationDate = new Date(Date.now()).toISOString();

  return {
    id: `${id}`,
    type: "article",
    sectionId: "world",
    sectionName: author,
    webPublicationDate,
    webTitle: headline,
    webUrl: url,
    apiUrl: "",
    isHosted: false,
    pillarId: "pillar/news",
    pillarName: "",
  };
}

export const ArticlesStore = types
  .model({
    status: StatusModel,
    error: types.string,
    articles: types.optional(types.array(ArticleModel), []),
    page: types.number,
    form: FormModel,
  })
  .views((self) => ({
    get statuses() {
      return {
        articles: {
          isLoading: self.status === DATA_STATE.loading,
          isLoaded: self.status === DATA_STATE.loaded,
          error: self.error,
        },
      };
    },
  }))
  .actions((self) => {
    const saveForm = (data: IDataForm) => {
      console.log(data);
      self.form.fields = { ...self.form.fields, ...data };
    };

    const nextStep = () => {
      if (self.form.step === 1) {
        self.form.step = 0;
        return;
      }
      self.form.step = self.form.step + 1;
    };

    const saveArticle = (dataForm2: IDataForm) => {
      const dataForm = { ...self.form.fields, ...dataForm2 };
      const article = prepareDataForArticle(dataForm, self.articles.length);
      self.articles = cast([article, ...self.articles]);
    };

    const getArticles = flow(function*(more?: boolean) {
      let articles = self.articles;

      if (self.page + 1 > MAX_PAGE) {
        return;
      }

      if (more) {
        self.page = self.page + 1;
      } else {
        self.status = DATA_STATE.loading;
        self.page = 1;
        articles = cast([]);
      }

      try {
        const { body }: IResponse<IData> = yield getApi<IParams>({
          url:
            "https://content.guardianapis.com/search",
          params: {
            page: self.page,
          },
        });

        self.articles = cast([...articles, ...body.response.results]);
      } catch (e) {
        self.status = e.message;
      }
      self.status = DATA_STATE.loaded;
    });

    return {
      getArticles,
      saveForm,
      nextStep,
      saveArticle,
    };
  });
