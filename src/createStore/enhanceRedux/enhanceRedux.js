import { compose, applyMiddleware } from 'redux'
import addDevTools from './addDevTools'
import listenFactory from './listenFactory'

/* eslint-env browser */
export default (options) => {
  const { listeners, drivers } = options
  let { enhancer } = options

  // add redux-devtools extension (if necessary)
  enhancer = addDevTools(options)

  // add custom listeners extension
  if (listeners) {
    const listen = listenFactory(listeners, drivers)

    // add this middleware to enhancer
    const middleware = applyMiddleware(listen.middleware)
    if (enhancer) return { enhancer: compose(middleware, enhancer), listen }

    return { enhancer: middleware, listen }
  }

  return { enhancer }
}
