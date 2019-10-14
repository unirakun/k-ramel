import React from "react";
import { StoreBase, when } from "k-ramel";
export declare const provider = <P extends StoreBase>(store: P) => (
  component: React.ReactComponentElement
) => React.ReactComponentElement;

export declare type StoreToProps<Store = {}, Props = {}, Drivers = {}> = (
  store: Store,
  props: Props,
  drivers: Drivers
) => any;

export declare const inject = <Store = {}, Props = {}, Drivers = {}>(
  storeToProps: StoreToProps<Store, Props, Drivers>
) => (component: React.ReactComponentElement) => React.ReactComponentElement;

export declare const listen = (listeners: Array, name?: string) => (
  component: React.ReactComponentElement
) => React.ReactComponentElement;
