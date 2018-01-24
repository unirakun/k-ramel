const withParams = ['get', 'getBy', 'hasKey']

const keysConfig = {
  keyValue: [
    // actions
    ['set', 'add', 'update', 'addOrUpdate', 'replace', 'remove', 'orderBy', 'reset'],
    // selectors
    ['get', 'getBy', 'getKeys', 'getAsArray', 'getLength', 'isInitialized', 'getState', 'hasKey'],
  ],
  simpleObject: [
    // actions
    ['set', 'update', 'reset'],
    // selectors
    ['get', 'isInitialized'],
  ],
}

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
