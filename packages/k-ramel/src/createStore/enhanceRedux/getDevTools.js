const getReduxDevToolsEnhancer = (name) => {
  if (typeof window === 'undefined') return undefined
  // eslint-disable-next-line no-underscore-dangle
  if (window.__REDUX_DEVTOOLS_EXTENSION__) return window.__REDUX_DEVTOOLS_EXTENSION__({ name })
  return undefined
}

export default (options) => {
  const { name, devtools } = options

  // no devtool enable
  if (!devtools) return undefined

  // return enhancer with devtools
  return getReduxDevToolsEnhancer(name)
}
