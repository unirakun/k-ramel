import { routerForBrowser, push, replace, go, goBack, goForward, block, unblock } from 'redux-little-router'
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

export default (config, selector) => {
  const { reducer, middleware, enhancer } = routerForBrowser(config)

  const driver = ({ dispatch, getState }) => {
    const get = () => selector(getState())
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
      getResultParam: key => get().result && get().result[key],
      getParentResultParam: key => getParentResultParam(get().result, key),
      isRoute: route => get().route === route,
      isParentResultParam: (key, value) => isParentResultParam(get().result, key, value),
    })
  }

  driver.getReducer = () => reducer
  driver.getEnhancer = () => compose(enhancer, applyMiddleware(middleware))

  return driver
}
