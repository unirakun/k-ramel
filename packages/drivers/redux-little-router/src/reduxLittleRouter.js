import { push, replace, go, goBack, goForward, block, unblock } from 'redux-little-router'

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

export default selector => ({ dispatch, getState }) => ({
  /* actions */
  push: path => dispatch(push(path)),
  replace: path => dispatch(replace(path)),
  go: nbLocations => dispatch(go(nbLocations)),
  goBack: () => dispatch(goBack()),
  goForward: () => dispatch(goForward()),
  block: callback => dispatch(block(callback)),
  unblock: () => dispatch(unblock()),
  /* route selectors */
  getState: () => selector(getState()),
  getRouteParam: key => selector(getState()).params && selector(getState()).params[key],
  getQueryParam: key => selector(getState()).query && selector(getState()).query[key],
  getResultParam: key => selector(getState()).result && selector(getState()).result[key],
  getParentResultParam: key => getParentResultParam(selector(getState()).result, key),
  isRoute: route => selector(getState()).route === route,
  isParentResultParam: (key, value) => isParentResultParam(selector(getState()).result, key, value),
})
