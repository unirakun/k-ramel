import { getFromPath } from '../utils'

const withParams = ['get', 'getBy', 'hasKey']

const keysConfig = {
  keyValue: [
    // actions
    ['set', 'add', 'update', 'addOrUpdate', 'remove', 'reset'],
    // selectors
    ['get', 'getBy', 'getKeys', 'getAsArray', 'getLength', 'isInitialized', 'getState', 'hasKey'],
  ],
  simple: [
    // actions
    ['set', 'update', 'reset'],
    // selectors
    ['get', 'isInitialized'],
  ],
}
keysConfig.simpleObject = keysConfig.simple
keysConfig['simple.object'] = keysConfig.simple
keysConfig['simple.array'] = keysConfig.simple
keysConfig['simple.bool'] = keysConfig.simple
keysConfig['simple.string'] = keysConfig.simple
keysConfig['simple.number'] = keysConfig.simple

export default (root, store) => {
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
    const reducer = getFromPath(root, nextPath)

    // - leaf (custom reducer)
    if (typeof reducer === 'function' && reducer.krfType === undefined) return reducer

    // - leaf (k-redux-factory)
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
            [selector]: (...args) => {
              if (withParams.includes(selector)) return legacySelector(...args)(store.getState())
              return legacySelector(store.getState())
            },
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
