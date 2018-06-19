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
  };

  var init = function init(selector) {
    return function (_ref3) {
      var getState = _ref3.getState,
          dispatch = _ref3.dispatch;

      var initialLocation = selector(getState());
      if (initialLocation) dispatch(reduxLittleRouter.initializeCurrentLocation(initialLocation));
    };
  };

  var reduxLittleRouter$1 = (function (config) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {
      return state.router;
    };
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'router';

    var _ref4 = isRouterImpl(config) ? config : reduxLittleRouter.routerForBrowser({ routes: config }),
        reducer = _ref4.reducer,
        middleware = _ref4.middleware,
        enhancer = _ref4.enhancer;

    return {
      getDriver: getDriver(selector),
      getReducer: function getReducer() {
        return { reducer: reducer, path: path };
      },
      getEnhancer: function getEnhancer() {
        return redux.compose(enhancer, redux.applyMiddleware(middleware));
      },
      init: init(selector)
    };
  });

  return reduxLittleRouter$1;

})));
//# sourceMappingURL=index.umd.js.map
