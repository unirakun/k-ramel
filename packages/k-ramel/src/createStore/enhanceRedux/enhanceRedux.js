import { compose } from 'redux'
import getDevTools from './getDevTools'
import listenFactory from './listenFactory'

/* eslint-env browser */
export default (options) => {
  const { listeners, drivers, enhancer } = options

  // devtools
  const devtools = getDevTools(options)

  // add custom listeners extension
  const listen = listenFactory(listeners, drivers, !!devtools)

  const enhancers = [
    enhancer,
    devtools,
    listen.enhancer,
  ].filter(Boolean)

  // add this middleware to enhancer
  return { enhancer: compose(...enhancers), listen }
}
