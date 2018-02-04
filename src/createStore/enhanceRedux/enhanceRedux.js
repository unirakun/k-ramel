import { compose, applyMiddleware } from 'redux'
import listenFactory from './listenFactory'

/* eslint-env browser */
export default (options) => {
  const { listeners, devtools, name } = options
  let { enhancer } = options

  // add devtools extension
  if (devtools && enhancer && window && window.devToolsExtension) {
    enhancer = compose(enhancer, window.devToolsExtension({ name }))
  }

  // add custom listeners extension
  if (listeners) {
    const listen = listenFactory(listeners)

    // add this middleware to enhancer
    const middleware = applyMiddleware(listen.middleware)
    if (enhancer) return { enhancer: compose(middleware, enhancer), listen }

    return { enhancer: middleware, listen }
  }

  return { enhancer }
}
