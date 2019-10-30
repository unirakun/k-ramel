declare module '@k-ramel/react' {
  import React from 'react'
  import { StoreBase, when } from 'k-ramel'
  export const provider = <P extends StoreBase>(store: P) => (component: React.ReactComponentElement) => React.ReactComponentElement

  export type StoreToProps<Store = {}, Props = {}, Drivers = {}> = (store: Store, props: Props, drivers: Drivers) => any

  export const inject = <Store = {}, Props = {}, Drivers = {}>(storeToProps: StoreToProps<Store, Props, Drivers>) => (component: React.ReactComponentElement) => React.ReactComponentElement

  export const listen = (listeners: Array, name?: string) => (component: React.ReactComponentElement) => React.ReactComponentElement
}
