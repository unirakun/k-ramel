import { compose } from 'redux'
import getDevTools from './getDevTools'
import listenFactory from './listenFactory'

/* eslint-env browser */
export default (options) => {
  const { listeners, drivers, enhancer } = options
  const listen = listenFactory(listeners, drivers)

  const enhancers = [
    listen.enhancer,
    enhancer,
    getDevTools(options),
  ].filter(en => en !== undefined)

  return {
    enhancer: compose(...enhancers),
    listen,
  }
}
