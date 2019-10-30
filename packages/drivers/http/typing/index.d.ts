declare module '@k-ramel/driver-http' {
  import { StoreBase, Driver, BaseAction } from 'k-ramel'

  const httpDriver: () => Driver

  export type HTTPOptions = Omit<body, RequestInit>
  export type RequestFunction = (url: string, body?: BodyInit | object, options?: HTTPOptions) => void

  export type HTTPDriver = (
    name: string,
    context?: object,
  ) => {
    post: RequestFunction
    get: RequestFunction
    head: RequestFunction
    patch: RequestFunction
    put: RequestFunction
    delete: RequestFunction
    options: RequestFunction
    connect: RequestFunction
  }

  export interface HTTPBaseAction<Payload> extends BaseAction {
    payload: Payload
    status: number
    headers: Headers
  }

  export default httpDriver
}
