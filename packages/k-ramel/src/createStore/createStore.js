import { createStore } from 'redux'
import http from '@k-ramel/driver-http'
import reduxFactory from './reduxFactory'
import toContext from './toContext'
import combine from './combine'
import enhanceRedux from './enhanceRedux'

const defaultOptions = {
  hideRedux: true,
  enhancer: undefined,
  init: {},
  listeners: undefined,
  devtools: true,
  name: 'store',
  drivers: {
    http,
  },
}

export default (definition, options = defaultOptions) => {
  // options
  const innerOptions = {
    ...defaultOptions,
    ...options,
    drivers: {
      ...defaultOptions.drivers,
      ...options.drivers,
    },
  }
  const { init, hideRedux, drivers } = innerOptions

  // this is reducer exports (action/selectors)
  let reducerTree = reduxFactory(definition)

  // instanciate the listen middleware and prepare redux enhancers
  const { enhancer, listen } = enhanceRedux(innerOptions)

  // this is the redux store
  const reduxStore = createStore(
    combine(reducerTree),
    init,
    enhancer,
  )

  // convert to a contextualized version
  if (hideRedux) {
    reducerTree = toContext(reducerTree, reduxStore)
  }

  // store (our own)
  const store = {
    ...reducerTree,
    ...reduxStore,
    listeners: {
      add: listen.addListeners,
      remove: listen.removeListeners,
    },
  }

  // store with driver
  store.drivers = Object.keys(drivers)
    .reduce(
      (acc, driver) => ({ ...acc, [driver]: drivers[driver](store) }),
      {},
    )

  // custom dispatch
  const reduxDispatch = store.dispatch
  store.dispatch = (action, ...args) => {
    if (typeof action === 'string') return reduxDispatch({ type: action })
    return reduxDispatch(action, ...args)
  }

  // pass store to listen (after it has been created)
  listen.setStore(store)

  return store
}
