import { routerForBrowser, push, replace, go, goBack, goForward, block, unblock, initializeCurrentLocation } from 'redux-little-router';
import { compose, applyMiddleware } from 'redux';

var _getParentResultParam = function _getParentResultParam(result, key) {
  if (!result) return undefined;
  if (result[key]) return result[key];
  return _getParentResultParam(result.parent, key);
};

var _isParentResultParam = function _isParentResultParam(result, key, value) {
  if (!result) return false;
  if (result[key] === value) return true;
  return _isParentResultParam(result.parent, key, value);
};

var isRouterImpl = function isRouterImpl(_ref) {
  var reducer = _ref.reducer,
      middleware = _ref.middleware,
      enhancer = _ref.enhancer;
  return reducer && enhancer && middleware;
};

var getDriver = function getDriver(selector) {
  return function (_ref2) {
    var dispatch = _ref2.dispatch,
        getState = _ref2.getState;

    var get = function get() {
      return selector(getState());
    };
    var getResult = function getResult() {
      return get().result;
    };

    return {
      /* actions */
      push: function push$$1(path) {
        return dispatch(push(path));
      },
      replace: function replace$$1(path) {
        return dispatch(replace(path));
      },
      go: function go$$1(nbLocations) {
        return dispatch(go(nbLocations));
      },
      goBack: function goBack$$1() {
        return dispatch(goBack());
      },
      goForward: function goForward$$1() {
        return dispatch(goForward());
      },
      block: function block$$1(callback) {
        return dispatch(block(callback));
      },
      unblock: function unblock$$1() {
        return dispatch(unblock());
      },
      /* route selectors */
      get: get,
      getRouteParam: function getRouteParam(key) {
        return get().params && get().params[key];
      },
      getQueryParam: function getQueryParam(key) {
        return get().query && get().query[key];
      },
      getResultParam: function getResultParam(key) {
        return getResult() && getResult()[key];
      },
      getParentResultParam: function getParentResultParam(key) {
        return _getParentResultParam(getResult(), key);
      },
      isRoute: function isRoute(route) {
        return get().route === route;
      },
      isParentResultParam: function isParentResultParam(key, value) {
        return _isParentResultParam(getResult(), key, value);
      }
    };
  };
};

var init = function init(selector) {
  return function (_ref3) {
    var getState = _ref3.getState,
        dispatch = _ref3.dispatch;

    var initialLocation = selector(getState());
    if (initialLocation) dispatch(initializeCurrentLocation(initialLocation));
  };
};

var reduxLittleRouter = (function (config) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {
    return state.router;
  };
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'router';

  var _ref4 = isRouterImpl(config) ? config : routerForBrowser({ routes: config }),
      reducer = _ref4.reducer,
      middleware = _ref4.middleware,
      enhancer = _ref4.enhancer;

  return {
    getDriver: getDriver(selector),
    getReducer: function getReducer() {
      return { reducer: reducer, path: path };
    },
    getEnhancer: function getEnhancer() {
      return compose(enhancer, applyMiddleware(middleware));
    },
    init: init(selector)
  };
});

export default reduxLittleRouter;
//# sourceMappingURL=index.es.js.map
