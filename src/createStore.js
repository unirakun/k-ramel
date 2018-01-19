import { combineReducers, createStore, applyMiddleware } from 'redux'
import factory from 'k-redux-factory'

const tree = (root) => {
  const subtree = (name, path) => {
    // first run
    if (name === undefined) {
      return Object
        .keys(root)
        .map(key => ({ [key]: subtree(key, '') }))
        .reduce(
          (acc, next) => ({ ...acc, ...next }),
          {},
        )
    }

    // other runs
    const nextPath = `${path ? `${path}.` : ''}${name}`
    const fullpath = `root.${nextPath}`
    const options = eval(fullpath) // eslint-disable-line no-eval
    const { type } = options

    // - leaf
    if (type) { // k-redux-factory
      return factory({ name, path, ...options })
    } else if (typeof options === 'function') { // custom reducer
      return options
    }

    // - branch
    return Object
      .keys(options)
      .map(key => ({ [key]: subtree(key, nextPath) }))
      .reduce(
        (acc, next) => ({ ...acc, ...next }),
        {},
      )
  }

  return subtree()
}

const combine = (root) => {
  const subcombine = (current) => {
    const reducers = Object
      .keys(current)
      .map((key) => {
        const cur = current[key]
        if (typeof cur === 'function') return ({ [key]: cur })
        return ({ [key]: subcombine(cur) })
      })
      .reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      )

    return combineReducers(reducers)
  }

  return subcombine(root)
}

const keysConfig = {
  keyValue: [
    // actions
    ['set', 'add', 'update', 'addOrUpdate', 'replace', 'remove', 'orderBy', 'reset'],
    // selectors
    ['get', 'getBy', 'getKeys', 'getAsArray', 'getLength', 'isInitialized', 'getState'],
  ],
  simpleObject: [
    // actions
    ['set', 'update', 'reset'],
    // selectors
    ['get', 'isInitialized'],
  ],
}
const toContext = (root, store) => {
  const subcontext = (name, path) => {
    // first run
    if (name === undefined) {
      return Object
        .keys(root)
        .map(key => ({ [key]: subcontext(key, '') }))
        .reduce(
          (acc, next) => ({ ...acc, ...next }),
          {},
        )
    }

    // other runs
    const nextPath = `${path ? `${path}.` : ''}${name}`
    const fullpath = `root.${nextPath}`
    const reducer = eval(fullpath) // eslint-disable-line no-eval

    // - leaf
    if (reducer.krfType !== undefined) {
      const keys = keysConfig[reducer.krfType]
      const [actions, selectors] = keys

      const actionsObject = actions
        .map((action) => {
          const legacyAction = reducer[action]

          return {
            [action]: (...args) => store.dispatch(legacyAction(...args)),
          }
        })
        .reduce(
          (acc, next) => ({ ...acc, ...next }),
          {},
        )
      const selectorsObject = selectors
        .map((selector) => {
          const legacySelector = reducer[selector]

          return {
            [selector]: (...args) => legacySelector(...args)(store.getState()),
          }
        })
        .reduce(
          (acc, next) => ({ ...acc, ...next }),
          {},
        )

      return Object.assign(reducer, actionsObject, selectorsObject)
    }

    // - branch
    return Object
      .keys(reducer)
      .map(key => ({ [key]: subcontext(key, nextPath) }))
      .reduce(
        (acc, next) => ({ ...acc, ...next }),
        {},
      )
  }

  return subcontext()
}

const defaultOptions = {
  hideRedux: true,
  middlewares: [],
  init: {},
}

export default (definition, options) => {
  // options
  const innerOptions = { ...defaultOptions, ...options }

  // this is reducer exports (action/selectors)
  let reducerTree = tree(definition)

  // this is the redux store
  const store = createStore(
    combine(reducerTree),
    innerOptions.init,
    applyMiddleware(...innerOptions.middlewares),
  )

  // convert to a contextualized version
  if (innerOptions.hideRedux) {
    reducerTree = toContext(reducerTree, store)
  }

  // exports
  return {
    ...store,
    ...reducerTree,
    getStore: () => store,
  }
}
