import { compose } from 'redux'

const getReduxDevToolsEnhancer = name => window.devToolsExtension({ name })

export default (options) => {
  const { name, devtools, enhancer } = options

  // no devtool enable
  if (!devtools || !window || !window.devToolsExtension) return enhancer

  // return enhancer with devtools
  const reduxDevtoolsEnhancer = getReduxDevToolsEnhancer(name)
  if (enhancer) return compose(enhancer, reduxDevtoolsEnhancer)
  return reduxDevtoolsEnhancer
}
