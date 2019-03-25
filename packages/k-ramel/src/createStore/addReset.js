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
      Object
        .keys(root)
        .forEach((key) => {
          subcontext(key, '')
        })
      return
    }

    // other runs
    const nextPath = `${path ? `${path}.` : ''}${name}`
    const reducer = getFromPath(root, nextPath)

    // - branch
    if (typeof reducer !== 'function' && name !== 'RESET') {
      Object
        .keys(reducer)
        .forEach((key) => {
          subcontext(key, nextPath)
        })
    }

    addReset(reducer, nextPath)
  }

  subcontext()

  return addReset(root)
}
