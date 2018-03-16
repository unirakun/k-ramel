(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('redux-little-router'), require('redux')) :
	typeof define === 'function' && define.amd ? define(['redux-little-router', 'redux'], factory) :
	(global['@k-ramel/driver-redux-little-router'] = factory(global['redux-little-router'],global.Redux));
}(this, (function (reduxLittleRouter,redux) { 'use strict';

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

var reduxLittleRouter$1 = (function (config, selector) {
  var _ref2 = isRouterImpl(config) ? config : reduxLittleRouter.routerForBrowser({ routes: config }),
      reducer = _ref2.reducer,
      middleware = _ref2.middleware,
      enhancer = _ref2.enhancer;

  var driver = function driver(_ref3) {
    var dispatch = _ref3.dispatch,
        getState = _ref3.getState;

    var get = function get() {
      return selector(getState());
    };
    var getResult = function getResult() {
      return get().result;
    };
    return {
      /* actions */
      push: function push(path) {
        return dispatch(reduxLittleRouter.push(path));
      },
      replace: function replace(path) {
        return dispatch(reduxLittleRouter.replace(path));
      },
      go: function go(nbLocations) {
        return dispatch(reduxLittleRouter.go(nbLocations));
      },
      goBack: function goBack() {
        return dispatch(reduxLittleRouter.goBack());
      },
      goForward: function goForward() {
        return dispatch(reduxLittleRouter.goForward());
      },
      block: function block(callback) {
        return dispatch(reduxLittleRouter.block(callback));
      },
      unblock: function unblock() {
        return dispatch(reduxLittleRouter.unblock());
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

  driver.getReducer = function () {
    return reducer;
  };
  driver.getEnhancer = function () {
    return redux.compose(enhancer, redux.applyMiddleware(middleware));
  };

  return driver;
});

return reduxLittleRouter$1;

})));
//# sourceMappingURL=index.umd.js.map
