import { StoreBase, Driver, BaseAction } from "k-ramel";

declare const httpDriver: () => Driver;

export declare type HTTPOptions = Omit<body, RequestInit>;
export declare type RequestFunction = (
  url: string,
  body?: BodyInit | object,
  options?: HTTPOptions
) => void;

export declare type HTTPDriver = (
  name: string,
  context?: object
) => {
  post: RequestFunction;
  get: RequestFunction;
  head: RequestFunction;
  patch: RequestFunction;
  put: RequestFunction;
  delete: RequestFunction;
  options: RequestFunction;
  connect: RequestFunction;
};

export declare interface HTTPBaseAction<Payload> extends BaseAction {
  payload: Payload;
  status: number;
  headers: Headers;
}

export default httpDriver;
