import { TypeDefinition, TypeDefinitionFunction } from 'k-redux-factory'
import { compose, applyMiddleware, Dispatch, enhanceMiddleware } from 'redux'
export { Types } from 'k-redux-factory'
declare type StoreOptions = {
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

export declare interface StoreDefinition {
  [key: string]: StoreDefinition | TypeDefinition
}

export declare interface StoreDefinitionBase {
  [key: string]: StoreDefinitionBase | ReducerType
}

declare type API = {
  [key: string]: any
}
declare type Driver<Store extends StoreDefinitionBase> = {
  getDriver: (store: Store) => API
  getReducer?: () => {
    path: string
    reducers: StoreDefinitionBase
  }
  init?: (store: Store) => void
  getEnhancer?: () => ReturnValue<typeof compose> | ReturnValue<typeof enhanceMiddleware>
}

export declare function createStore<Store extends StoreDefinitionBase>(definition: StoreDefinition, options?: StoreOptions): Store
export declare const types: TypeDefinitionFunction

export declare interface StoreBase extends StoreDefinitionBase {
  dispatch: Dispatch
}

export declare type BaseAction = {
  type: string
}

export declare interface ReactionType<Action extends BaseAction = BaseAction, Store = {}, Drivers = {}> extends Function {
  (action: Action, store: Store, drivers: Drivers): void
}

export declare const when = (type: string | RegExp) => (reaction: typeof ReactionType) => {}
