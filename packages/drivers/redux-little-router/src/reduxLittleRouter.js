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

const routeSelectors = (currentState = {}) => ({
  getState: () => currentState,
  getRouteParam: key => currentState.params && currentState.params[key],
  getQueryParam: key => currentState.query && currentState.query[key],
  getResultParam: key => currentState.result && currentState.result[key],
  getParentResultParam: key => getParentResultParam(currentState.result, key),
  isRoute: route => currentState.route === route,
  isParentResultParam: (key, value) => isParentResultParam(currentState.result, key, value),
})

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
  ...routeSelectors(selector(getState())),
  /* previous route selectors */
  getPreviousRoute: () => routeSelectors(selector(getState()).previous),
})
