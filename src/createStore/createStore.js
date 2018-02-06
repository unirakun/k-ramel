import { createStore } from 'redux'
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
    http: (...args) => fetch(...args),
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
  const { init, hideRedux } = innerOptions

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

  // exported store (our own)
  const store = {
    ...reducerTree,
    ...reduxStore,
  }

  // pass store to listen (after it has been created)
  if (listen) listen.setStore(store)

  return store
}
