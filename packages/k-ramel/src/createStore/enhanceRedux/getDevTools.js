const getReduxDevToolsEnhancer = (options) => {
  if (typeof window === 'undefined') return undefined

  const { name, trace, traceLimit } = options

  // eslint-disable-next-line no-underscore-dangle
  if (window.__REDUX_DEVTOOLS_EXTENSION__) return window.__REDUX_DEVTOOLS_EXTENSION__({ name, trace, traceLimit })
  return undefined
}

export default (options) => {
  const { devtools } = options

  // devtool is explicitely disabled
  if (devtools === false) return undefined

  // production build
  if (
    devtools === undefined // devtools is not explicitely enabled
    && typeof process !== 'undefined' // process exists
    && process.env // env exists
    && process.env.NODE_ENV === 'production' // production build -> unactivate
  ) {
    return undefined
  }

  // return enhancer with devtools
  return getReduxDevToolsEnhancer(options)
}
