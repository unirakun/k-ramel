const getReduxDevToolsEnhancer = (name) => {
  if (typeof window === 'undefined') return undefined
  if (window.devToolsExtension) return window.devToolsExtension({ name })
  return undefined
}

export default (options) => {
  const { name, devtools } = options

  // no devtool enable
  if (!devtools) return undefined

  // return enhancer with devtools
  return getReduxDevToolsEnhancer(name)
}
