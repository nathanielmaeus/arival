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
  const webPublicationDate = new Date(Date.now()).toISOString();

  return {
    id:
      "world/2020/may/21/nhs-groups-nervous-about-lockdown-easing-without-contact-tracing",
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
    status: types.enumeration("State", [
      "initial",
      "loading",
      "loaded",
      "failed",
    ]),
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

    const nextStep = () => {
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
          url:
            "https://content.guardianapis.com/search?api-key=91d2be46-870f-46ca-9378-36090d49caea",
          params: {
            country: "ru",
            page: self.page,
            ...params,
          },
        });

        self.articles = cast([...articles, ...body.response.results]);
      } catch (e) {
        self.status = e.message;
      }
      self.status = DATA_STATE.loaded;
    });

    return {
      setCategory,
      getArticles,
      searchArticles,
      saveForm,
      nextStep,
      saveArticle,
    };
  });
