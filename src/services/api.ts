import { API_KEY } from "src/constants";
import * as superagent from "superagent";

export interface IResponse<T> {
  body: T;
  error: string;
}

interface IApi<T> {
  url: string;
  params?: T;
}

export async function getApi<T extends object>({ url, params }: IApi<T>) {
  const response = await superagent["get"](url).query({
    "api-key": API_KEY,
    ...params,
  });
  return response;
}
