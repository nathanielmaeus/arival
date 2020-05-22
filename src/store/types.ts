import { types } from "mobx-state-tree";

export enum DATA_STATE {
  initial = "initial",
  loading = "loading",
  loaded = "loaded",
  failed = "failed",
}

export const StatusModel = types.enumeration("State", [
  DATA_STATE.initial,
  DATA_STATE.loading,
  DATA_STATE.loaded,
  DATA_STATE.failed,
]);

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
