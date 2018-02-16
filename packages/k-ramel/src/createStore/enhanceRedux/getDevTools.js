const getReduxDevToolsEnhancer = name => window.devToolsExtension({ name })

export default (options) => {
  const { name, devtools } = options

  // no devtool enable
  if (!devtools || !window || !window.devToolsExtension) return undefined

  // return enhancer with devtools
  return getReduxDevToolsEnhancer(name)
}
