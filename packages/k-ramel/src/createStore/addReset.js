import { getFromPath } from '../utils'

export const TYPE = '@@krml/RESET'

const resetFactory = path => () => ({ type: TYPE, payload: path })

const addResetFactory = (options, dispatch) => (object, path) => {
  let reset = resetFactory(path)
  if (options.hideRedux) {
    const legacyReset = reset
    reset = () => dispatch(legacyReset())
  }

  object.reset = reset // eslint-disable-line no-param-reassign
  object.RESET = TYPE // eslint-disable-line no-param-reassign

  return object
}

export default options => (root, store) => {
  const addReset = addResetFactory(options, store.dispatch)
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

    // - branch
    let next = reducer
    if (typeof reducer !== 'function' && name !== 'RESET') {
      next = Object
        .keys(reducer)
        .map(key => ({ [key]: subcontext(key, nextPath) }))
        .reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {},
        )
    }

    addReset(reducer, nextPath)

    return next
  }

  subcontext()

  return addReset(root)
}
