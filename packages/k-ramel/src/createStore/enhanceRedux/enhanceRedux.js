import { compose } from 'redux'
import addDevTools from './addDevTools'
import listenFactory from './listenFactory'

/* eslint-env browser */
export default (options) => {
  const { listeners, drivers, enhancer } = options

  // add redux-devtools extension (if necessary)
  const devTools = addDevTools(options)

  // add custom listeners extension
  const listen = listenFactory(listeners, drivers)

  const enhancers = [
    listen.enhancer,
    enhancer,
    devTools,
  ].filter(en => en !== undefined)

  return {
    enhancer: compose(...enhancers),
    listen,
  }
}
