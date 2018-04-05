(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('k-redux-factory'), require('redux'), require('@k-ramel/driver-http'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'k-redux-factory', 'redux', '@k-ramel/driver-http', 'lodash'], factory) :
  (factory((global['k-ramel'] = {}),global['k-redux-factory'],global.Redux,global['@k-ramel/driver-http'],global._));
}(this, (function (exports,factory,redux,http,lodash) { 'use strict';

  factory = factory && factory.hasOwnProperty('default') ? factory['default'] : factory;
  http = http && http.hasOwnProperty('default') ? http['default'] : http;

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var reduxFactory = (function (root) {
    var subtree = function subtree(name, path) {
      // first run
      if (name === undefined) {
        return Object.keys(root).map(function (key) {
          return defineProperty({}, key, subtree(key, ''));
        }).reduce(function (acc, next) {
          return _extends({}, acc, next);
        }, {});
      }

      // other runs
      var nextPath = '' + (path ? path + '.' : '') + name;
      var fullpath = 'root.' + nextPath;
      var options = eval(fullpath); // eslint-disable-line no-eval
      var type = options.type;

      // - leaf

      if (type) {
        // k-redux-factory
        return factory(_extends({
          name: name,
          path: path,
          prefix: path && path.replace(/\./g, '_') || ''
        }, options));
      } else if (typeof options === 'function') {
        // custom reducer
        return options;
      }

      // - branch
      return Object.keys(options).map(function (key) {
        return defineProperty({}, key, subtree(key, nextPath));
      }).reduce(function (acc, next) {
        return _extends({}, acc, next);
      }, {});
    };

    return subtree();
  });

  var withParams = ['get', 'getBy', 'hasKey'];

  var keysConfig = {
    keyValue: [
    // actions
    ['set', 'add', 'update', 'addOrUpdate', 'replace', 'remove', 'orderBy', 'reset'],
    // selectors
    ['get', 'getBy', 'getKeys', 'getAsArray', 'getLength', 'isInitialized', 'getState', 'hasKey']],
    simpleObject: [
    // actions
    ['set', 'update', 'reset'],
    // selectors
    ['get', 'isInitialized']]
  };

  var toContext = (function (root, store) {
    var subcontext = function subcontext(name, path) {
      // first run
      if (name === undefined) {
        return Object.keys(root).map(function (key) {
          return defineProperty({}, key, subcontext(key, ''));
        }).reduce(function (acc, next) {
          return _extends({}, acc, next);
        }, {});
      }

      // other runs
      var nextPath = '' + (path ? path + '.' : '') + name;
      var fullpath = 'root.' + nextPath;
      var reducer = eval(fullpath); // eslint-disable-line no-eval

      // - leaf
      if (reducer.krfType !== undefined) {
        var keys = keysConfig[reducer.krfType];

        var _keys = slicedToArray(keys, 2),
            actions = _keys[0],
            selectors = _keys[1];

        var actionsObject = actions.map(function (action) {
          var legacyAction = reducer[action];

          return defineProperty({}, action, function () {
            return store.dispatch(legacyAction.apply(undefined, arguments));
          });
        }).reduce(function (acc, next) {
          return _extends({}, acc, next);
        }, {});
        var selectorsObject = selectors.map(function (selector) {
          var legacySelector = reducer[selector];

          return defineProperty({}, selector, function () {
            if (withParams.includes(selector)) return legacySelector.apply(undefined, arguments)(store.getState());
            return legacySelector(store.getState());
          });
        }).reduce(function (acc, next) {
          return _extends({}, acc, next);
        }, {});

        return Object.assign(reducer, actionsObject, selectorsObject);
      }

      // - branch
      return Object.keys(reducer).map(function (key) {
        return defineProperty({}, key, subcontext(key, nextPath));
      }).reduce(function (acc, next) {
        return _extends({}, acc, next);
      }, {});
    };

    return subcontext();
  });

  var combine = (function (root) {
    var subcombine = function subcombine(current) {
      var reducers = Object.keys(current).map(function (key) {
        var cur = current[key];
        if (typeof cur === 'function') return defineProperty({}, key, cur);
        return defineProperty({}, key, subcombine(cur));
      }).reduce(function (acc, curr) {
        return _extends({}, acc, curr);
      }, {});

      return redux.combineReducers(reducers);
    };

    return subcombine(root);
  });

  var getReduxDevToolsEnhancer = function getReduxDevToolsEnhancer(name) {
    return window.devToolsExtension({ name: name });
  };

  var getDevTools = (function (options) {
    var name = options.name,
        devtools = options.devtools;

    // no devtool enable

    if (!devtools || !window || !window.devToolsExtension) return undefined;

    // return enhancer with devtools
    return getReduxDevToolsEnhancer(name);
  });

  var listenFactory = (function () {
    var rootListeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var withDevTools = arguments[2];

    // k-ramel store
    var innerStore = void 0;

    // k-ramel listners
    var innerListeners = [rootListeners];

    return {
      // this setter is needed since the middleware is pass to redux
      // createStore, and then BEFORE, we have store instanciated
      setStore: function setStore(store) {
        innerStore = store;
      },

      // this is to add new listeners
      addListeners: function addListeners(listeners) {
        innerListeners = [].concat(toConsumableArray(innerListeners), [listeners]);
      },

      // this is to remove listeners
      removeListeners: function removeListeners(listeners) {
        innerListeners = innerListeners.filter(function (l) {
          return l !== listeners;
        });
      },

      // redux middleware
      enhancer: redux.applyMiddleware(function () {
        return function (next) {
          return function (action) {
            var innerAction = withDevTools ? action.action || action : action;

            // dispatch action
            var res = next(action);

            // trigger listeners
            innerListeners.forEach(function (listeners) {
              try {
                listeners.forEach(function (listener) {
                  listener(innerAction, innerStore, innerStore.drivers);
                });
              } catch (exception) {
                innerStore.dispatch({
                  type: '@@krml/EXCEPTION',
                  payload: {
                    from: action,
                    exception: exception,
                    message: exception.message
                  }
                });
              }
            });

            // return action result
            return res;
          };
        };
      })
    };
  });

  /* eslint-env browser */
  var enhanceRedux = (function (options) {
    var listeners = options.listeners,
        drivers = options.drivers,
        enhancer = options.enhancer;

    // devtools

    var devtools = getDevTools(options);

    // add custom listeners extension
    var listen = listenFactory(listeners, drivers, !!devtools);

    var enhancers = [enhancer, devtools, listen.enhancer].filter(Boolean);

    // add this middleware to enhancer
    return { enhancer: redux.compose.apply(undefined, toConsumableArray(enhancers)), listen: listen };
  });

  var defaultOptions = {
    hideRedux: true,
    enhancer: undefined,
    init: {},
    listeners: undefined,
    devtools: true,
    name: 'store',
    drivers: {
      http: http()
    }
  };

  var createStore = (function (definition) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

    // options
    var innerOptions = _extends({}, defaultOptions, options, {
      drivers: _extends({}, defaultOptions.drivers, options.drivers)
    });
    var init = innerOptions.init,
        hideRedux = innerOptions.hideRedux,
        drivers = innerOptions.drivers;

    var definitionWithDrivers = _extends({}, definition);

    // use drivers
    var driversEnhancers = [];
    var driversInits = [];
    Object.values(drivers).forEach(function (driver) {
      // bind reducer to store definition
      if (driver.getReducer) {
        var _driver$getReducer = driver.getReducer(),
            reducer = _driver$getReducer.reducer,
            path = _driver$getReducer.path; // eslint-disable-line no-unused-vars


        eval('definitionWithDrivers' + (path.length > 0 ? '.' : '') + path + '=reducer'); // eslint-disable-line no-eval
      }

      // add enhancer
      if (driver.getEnhancer) driversEnhancers.push(driver.getEnhancer());

      // add init
      if (driver.init) driversInits.push(driver.init);
    });

    // add all driver enhancers
    if (innerOptions.enhancer) driversEnhancers.push(innerOptions.enhancer);
    innerOptions.enhancer = redux.compose.apply(undefined, driversEnhancers);

    // this is reducer exports (action/selectors)
    var reducerTree = reduxFactory(definitionWithDrivers);

    // instanciate the listen middleware and prepare redux enhancers

    var _enhanceRedux = enhanceRedux(innerOptions),
        enhancer = _enhanceRedux.enhancer,
        listen = _enhanceRedux.listen;

    // this is the redux store


    var reduxStore = redux.createStore(combine(reducerTree), init, enhancer);

    // convert to a contextualized version
    if (hideRedux) {
      reducerTree = toContext(reducerTree, reduxStore);
    }

    // store (our own)
    var store = _extends({}, reducerTree, reduxStore, {
      listeners: {
        add: listen.addListeners,
        remove: listen.removeListeners
      }

      // store with driver
    });store.drivers = Object.keys(drivers).reduce(function (acc, driver) {
      return _extends({}, acc, defineProperty({}, driver, drivers[driver].getDriver(store)));
    }, {});

    // custom dispatch
    var reduxDispatch = store.dispatch;
    store.dispatch = function (action) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (typeof action === 'string') return reduxDispatch({ type: action });
      return reduxDispatch.apply(undefined, [action].concat(args));
    };

    // pass store to listen (after it has been created)
    listen.setStore(store);

    // init drivers
    driversInits.forEach(function (driverInit) {
      return driverInit(store);
    });

    return store;
  });

  var keyValue = function keyValue(params) {
    return _extends({}, params, { type: 'keyValue' });
  };
  var simpleObject = function simpleObject(params) {
    return _extends({}, params, { type: 'simpleObject' });
  };

  var isMatching = function isMatching(action, store) {
    return function (matcher) {
      return (// test matching
        // to a string
        lodash.isString(matcher) && action.type === matcher ||
        // to a function
        lodash.isFunction(matcher) && matcher(action, store)
        // to a regexp
        || lodash.isRegExp(matcher) && action.type.match(matcher)
      );
    };
  };

  var _when = function _when() {
    for (var _len = arguments.length, matchers = Array(_len), _key = 0; _key < _len; _key++) {
      matchers[_key] = arguments[_key];
    }

    return function (callback) {
      return function (action, store, drivers) {
        var match = matchers.reduce(function (acc, curr) {
          return acc && isMatching(action, store)(curr);
        }, true);

        if (match) return callback(action, store, drivers);
        return false;
      };
    };
  };
  var reaction = function reaction(fn) {
    return Object.assign(fn, { when: function when() {
        return _when.apply(undefined, arguments)(fn);
      } });
  };

  var reactions = function reactions(fns) {
    return Object.keys(fns).reduce(function (acc, curr) {
      return _extends({}, acc, defineProperty({}, curr, reaction(fns[curr])));
    }, {});
  };

  exports.applyMiddleware = redux.applyMiddleware;
  exports.compose = redux.compose;
  exports.createStore = createStore;
  exports.keyValue = keyValue;
  exports.simpleObject = simpleObject;
  exports.when = _when;
  exports.reaction = reaction;
  exports.reactions = reactions;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
