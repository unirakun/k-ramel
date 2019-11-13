declare module 'k-ramel' {
  import { TypeDefinition, TypeDefinitionFunction } from 'k-redux-factory'
  import { compose, applyMiddleware, Dispatch, enhanceMiddleware } from 'redux'
  export { Types } from 'k-redux-factory'
  export type StoreOptions = {
    hideRedux?: boolean
    enhancer?: any
    init?: any
    listeners?: any
    devtools?: any
    trace?: boolean
    traceLimit?: number
    name?: string
    drivers?: any
  }

  export interface StoreDefinition {
    [key: string]: StoreDefinition | TypeDefinition
  }

  export interface StoreDefinitionBase {
    [key: string]: StoreDefinitionBase | ReducerType
  }

  export type API = {
    [key: string]: any
  }
  export type Driver<Store extends StoreDefinitionBase> = {
    getDriver: (store: Store) => API
    getReducer?: () => {
      path: string
      reducers: StoreDefinitionBase
    }
    init?: (store: Store) => void
    getEnhancer?: () => ReturnValue<typeof compose> | ReturnValue<typeof enhanceMiddleware>
  }

  export function createStore<Store extends StoreDefinitionBase>(definition: StoreDefinition, options?: StoreOptions): Store
  export const types: TypeDefinitionFunction

  export interface StoreBase extends StoreDefinitionBase {
    dispatch: Dispatch
  }

  export type BaseAction = {
    type: string
  }

  export interface ReactionType<Action extends BaseAction = BaseAction, Store = {}, Drivers = {}> extends Function {
    (action: Action, store: Store, drivers: Drivers): void
  }

  export const when = (type: string | RegExp) => (reaction: typeof ReactionType) => {}
}
