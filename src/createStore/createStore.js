import { createStore, compose, applyMiddleware } from 'redux'
import reduxFactory from './reduxFactory'
import toContext from './toContext'
import combine from './combine'
import listenFactory from './listen'

const defaultOptions = {
  hideRedux: true,
  enhancer: undefined,
  init: {},
  listeners: undefined,
}

export default (definition, options = defaultOptions) => {
  // options
  const innerOptions = { ...defaultOptions, ...options }

  // this is reducer exports (action/selectors)
  let reducerTree = reduxFactory(definition)

  // listeners are there, instanciate the listen middleware
  let listen
  let { enhancer } = innerOptions
  if (innerOptions.listeners) {
    listen = listenFactory(innerOptions.listeners)

    // add this middleware to enhancer
    const { middleware } = listen
    if (enhancer) enhancer = compose(enhancer, applyMiddleware(middleware))
    enhancer = applyMiddleware(middleware)
  }

  // this is the redux store
  const reduxStore = createStore(
    combine(reducerTree),
    innerOptions.init,
    enhancer,
  )

  // convert to a contextualized version
  if (innerOptions.hideRedux) {
    reducerTree = toContext(reducerTree, reduxStore)
  }

  // exported store (our own)
  const store = {
    ...reducerTree,
    ...reduxStore,
    getStore: () => reduxStore,
  }

  // pass store to listen (after it has be created)
  if (listen) listen.setStore(store)

  return store
}
