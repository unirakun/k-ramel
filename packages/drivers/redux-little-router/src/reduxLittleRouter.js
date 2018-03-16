import { routerForBrowser, push, replace, go, goBack, goForward, block, unblock, initializeCurrentLocation } from 'redux-little-router'
import { compose, applyMiddleware } from 'redux'

const getParentResultParam = (result, key) => {
  if (!result) return undefined
  if (result[key]) return result[key]
  return getParentResultParam(result.parent, key)
}

const isParentResultParam = (result, key, value) => {
  if (!result) return false
  if (result[key] === value) return true
  return isParentResultParam(result.parent, key, value)
}

const isRouterImpl = ({ reducer, middleware, enhancer }) => reducer && enhancer && middleware

const getDriver = selector => ({ dispatch, getState }) => {
  const get = () => selector(getState())
  const getResult = () => get().result

  return ({
    /* actions */
    push: path => dispatch(push(path)),
    replace: path => dispatch(replace(path)),
    go: nbLocations => dispatch(go(nbLocations)),
    goBack: () => dispatch(goBack()),
    goForward: () => dispatch(goForward()),
    block: callback => dispatch(block(callback)),
    unblock: () => dispatch(unblock()),
    /* route selectors */
    get,
    getRouteParam: key => get().params && get().params[key],
    getQueryParam: key => get().query && get().query[key],
    getResultParam: key => getResult() && getResult()[key],
    getParentResultParam: key => getParentResultParam(getResult(), key),
    isRoute: route => get().route === route,
    isParentResultParam: (key, value) => isParentResultParam(getResult(), key, value),
  })
}

const init = selector => ({ getState, dispatch }) => {
  const initialLocation = selector(getState())
  if (initialLocation) dispatch(initializeCurrentLocation(initialLocation))
}

export default (config, selector) => {
  const {
    reducer,
    middleware,
    enhancer,
  } = isRouterImpl(config) ? config : routerForBrowser({ routes: config })

  return {
    getDriver: getDriver(selector),
    getReducer: () => ({ reducer, path: 'router' }), // FIXME: hardcoded router
    getEnhancer: () => compose(enhancer, applyMiddleware(middleware)),
    init: init(selector),
  }
}
