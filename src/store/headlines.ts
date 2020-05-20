import { ICategory } from "../types/index";
import { types, flow, cast } from "mobx-state-tree";

import { IArticle } from "src/types";
import { IResponse, getApi } from "src/services/api";
import { DATA_STATE } from "./types";
import { IDataForm } from "src/components/organisms/form/source-form";

interface IQuery {
  search: string;
  category: ICategory;
  order: string;
  sorting: string;
}

interface IData {
  status: string;
  totalResults: number;
  articles: IArticle[];
}

type countryParamType = "ru" | "us";

export interface IParams {
  category?: ICategory;
  country?: countryParamType;
  q?: string;
  sources?: string;
  pageSize?: number;
  page?: number;
}

const MAX_PAGE = 5;

export const SourceType = types.model({
  id: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
});

export const ArticleModel = types.model({
  author: types.maybeNull(types.string),
  title: types.string,
  description: types.maybeNull(types.string),
  url: types.string,
  urlToImage: types.maybeNull(types.string),
  publishedAt: types.string,
  content: types.maybeNull(types.string),
  source: SourceType,
});

export const CategoryType = types.maybe(
  types.union(
    types.literal("business"),
    types.literal("sports"),
    types.literal("entertainment"),
    types.literal("general"),
    types.literal("health"),
    types.literal("science"),
    types.literal("technology")
  )
);

export const SourceModel = types.model({
  articles: types.optional(types.array(ArticleModel), []),
  status: types.enumeration("State", [
    "initial",
    "loading",
    "loaded",
    "failed",
  ]),
  error: types.string,
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

function prepareDataForArticle(dataForm: IDataForm) {
  const { url, author, headline, text } = dataForm;
  const publishedAt = new Date(Date.now()).toISOString();

  return {
    url,
    publishedAt,
    author,
    title: headline,
    description: text,
    urlToImage: null,
    content: null,
    source: {
      id: "1",
      name: dataForm.sourceMedia,
    },
  };
}
export const ArticlesStore = types
  .model({
    status: types.enumeration("State", [
      "initial",
      "loading",
      "loaded",
      "failed",
    ]),
    error: types.string,
    articles: types.optional(types.array(ArticleModel), []),
    source: SourceModel,
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
        source: {
          isLoading: self.source.status === DATA_STATE.loading,
          isLoaded: self.source.status === DATA_STATE.loaded,
          error: self.source.error,
        },
      };
    },
  }))
  .actions((self) => {
    const setCategory = (query: IQuery) => {
      const params: IParams = {
        q: query.search,
        category: query.category,
      };
      getArticles(params);
    };

    const saveForm = (data: IDataForm) => {
      console.log(data);
      self.form.fields = { ...self.form.fields, ...data };
    };

    const nextStep = (data: IDataForm) => {
      if (self.form.step === 1) {
        self.form.step = 0;
        return;
      }
      self.form.step = self.form.step + 1;
    };

    const saveArticle = (dataForm2: IDataForm) => {
      const dataForm = { ...self.form.fields, ...dataForm2 };
      const article = prepareDataForArticle(dataForm);
      self.articles = cast([article, ...self.articles]);
    };

    const searchArticles = (query: IQuery) => {
      const params: IParams = {
        q: query.search,
        category: query.category,
      };
      getArticles(params);
    };

    const getArticles = flow(function*(params?: IParams, more?: boolean) {
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
          url: "https://newsapi.org/v2/top-headlines",
          params: {
            country: "ru",
            page: self.page,
            ...params,
          },
        });

        self.articles = cast([...articles, ...body.articles]);
      } catch (e) {
        self.status = e.message;
      }
      self.status = DATA_STATE.loaded;
    });

    const getSourceArticles = flow(function*(sourceId) {
      self.source.status = DATA_STATE.loading;

      try {
        const { body }: IResponse<IData> = yield getApi<IParams>({
          url: "https://newsapi.org/v2/top-headlines",
          params: {
            sources: sourceId,
          },
        });

        self.source.articles = cast(body.articles);
      } catch (e) {
        self.source.status = DATA_STATE.failed;
        self.source.error = e.message;
      }
      self.source.status = DATA_STATE.loaded;
    });

    return {
      setCategory,
      getArticles,
      getSourceArticles,
      searchArticles,
      saveForm,
      nextStep,
      saveArticle,
    };
  });
