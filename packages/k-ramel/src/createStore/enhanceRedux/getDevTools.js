const getReduxDevToolsEnhancer = (options) => {
  if (typeof window === 'undefined') return undefined

  const { name, trace, traceLimit } = options

  // eslint-disable-next-line no-underscore-dangle
  if (window.__REDUX_DEVTOOLS_EXTENSION__) return window.__REDUX_DEVTOOLS_EXTENSION__({ name, trace, traceLimit })
  return undefined
}

export default (options) => {
  const { devtools } = options

  // no devtool enable
  if (!devtools) return undefined

  // production build
  if (
    typeof process !== 'undefined'
    && process.env
    && process.env.NODE_ENV === 'production'
  ) {
    return undefined
  }

  // return enhancer with devtools
  return getReduxDevToolsEnhancer(options)
}
