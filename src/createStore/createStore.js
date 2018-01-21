import { createStore } from 'redux'
import reduxFactory from './reduxFactory'
import toContext from './toContext'
import combine from './combine'

const defaultOptions = {
  hideRedux: true,
  middlewares: [],
  init: {},
}

export default (definition, options = defaultOptions) => {
  // options
  const innerOptions = { ...defaultOptions, ...options }

  // this is reducer exports (action/selectors)
  let reducerTree = reduxFactory(definition)

  // this is the redux store
  const store = createStore(
    combine(reducerTree),
    innerOptions.init,
    innerOptions.enhancer,
  )

  // convert to a contextualized version
  if (innerOptions.hideRedux) {
    reducerTree = toContext(reducerTree, store)
  }

  // exports
  return {
    ...reducerTree,
    getStore: () => store,
    getState: store.getState,
    dispatch: store.dispatch,
  }
}
