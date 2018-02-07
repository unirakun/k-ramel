(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('k-redux-factory'), require('redux'), require('lodash')) :
	typeof define === 'function' && define.amd ? define(['exports', 'k-redux-factory', 'redux', 'lodash'], factory) :
	(factory((global['k-simple-state'] = {}),global['k-redux-factory'],global.Redux,global._));
}(this, (function (exports,factory,redux,lodash) { 'use strict';

factory = factory && factory.hasOwnProperty('default') ? factory['default'] : factory;

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};









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

var addDevTools = (function (options) {
  var name = options.name,
      devtools = options.devtools,
      enhancer = options.enhancer;

  // no devtool enable

  if (!devtools || !window || !window.devToolsExtension) return enhancer;

  // return enhancer with devtools
  var reduxDevtoolsEnhancer = getReduxDevToolsEnhancer(name);
  if (enhancer) return redux.compose(enhancer, reduxDevtoolsEnhancer);
  return reduxDevtoolsEnhancer;
});

var listenFactory = (function (listeners, drivers) {
  // k-simple-state store
  var innerStore = void 0;

  // k-simple-state drivers (enhanced with store)
  var innerDrivers = void 0;

  return {
    // this setter is needed since the middleware is pass to redux
    // createStore, and then BEFORE, we have store instanciated
    setStore: function setStore(store) {
      innerStore = store;
      innerDrivers = Object.keys(drivers).reduce(function (acc, driver) {
        return _extends({}, acc, defineProperty({}, driver, drivers[driver](store)));
      }, {});
    },

    // redux middleware
    middleware: function middleware() {
      return function (next) {
        return function (action) {
          // dispatch action
          var res = next(action);

          // trigger listeners
          listeners.forEach(function (listener) {
            listener(action, innerStore, innerDrivers);
          });

          // return action result
          return res;
        };
      };
    }
  };
});

/* eslint-env browser */
var enhanceRedux = (function (options) {
  var listeners = options.listeners,
      drivers = options.drivers;
  var enhancer = options.enhancer;

  // add redux-devtools extension (if necessary)

  enhancer = addDevTools(options);

  // add custom listeners extension
  if (listeners) {
    var listen = listenFactory(listeners, drivers);

    // add this middleware to enhancer
    var middleware = redux.applyMiddleware(listen.middleware);
    if (enhancer) return { enhancer: redux.compose(middleware, enhancer), listen: listen };

    return { enhancer: middleware, listen: listen };
  }

  return { enhancer: enhancer };
});

var _this = undefined;

var dispatchFactory = function dispatchFactory(store) {
  return function (name) {
    return function (method) {
      return function (event, payload, status) {
        return store.dispatch({ type: '@@http/' + name + '>' + method + '>' + event, payload: payload, status: status });
      };
    };
  };
};

var http = (function (store) {
  return function (name) {
    return function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _options$method, method, _options$headers, headers, type, dispatch, data, raw, _ref2, _raw, status;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // options
                _options$method = options.method, method = _options$method === undefined ? 'GET' : _options$method, _options$headers = options.headers, headers = _options$headers === undefined ? {} : _options$headers;
                type = headers['Content-Type'] || '';

                // dispatcher

                dispatch = dispatchFactory(store)(name)(method);

                // request

                data = void 0;
                raw = void 0;

                dispatch('STARTED');
                _context.prev = 6;
                _context.next = 9;
                return (_ref2 = global || window).fetch.apply(_ref2, [url, options].concat(toConsumableArray(args)));

              case 9:
                raw = _context.sent;

                data = raw;

                if (!type.includes('json')) {
                  _context.next = 15;
                  break;
                }

                _context.next = 14;
                return raw.json();

              case 14:
                data = _context.sent;

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](6);

                dispatch('FAILED', _context.t0, (raw || {}).status);
                return _context.abrupt('return', _context.t0);

              case 21:
                _raw = raw, status = _raw.status;

                if (status >= 400 || status < 200) {
                  dispatch('FAILED', data, status);
                } else {
                  dispatch('ENDED', data, status);
                }

                return _context.abrupt('return', data);

              case 24:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[6, 17]]);
      }));

      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }();
  };
});

var drivers = {
  http: http
};

var defaultOptions = {
  hideRedux: true,
  enhancer: undefined,
  init: {},
  listeners: undefined,
  devtools: true,
  name: 'store',
  drivers: drivers
};

var createStore = (function (definition) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

  // options
  var innerOptions = _extends({}, defaultOptions, options, {
    drivers: _extends({}, defaultOptions.drivers, options.drivers)
  });
  var init = innerOptions.init,
      hideRedux = innerOptions.hideRedux;

  // this is reducer exports (action/selectors)

  var reducerTree = reduxFactory(definition);

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

  // exported store (our own)
  var store = _extends({}, reducerTree, reduxStore);

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
  if (listen) listen.setStore(store);

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
      var match = matchers.map(isMatching(action, store)).reduce(function (acc, curr) {
        return acc && curr;
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
//# sourceMappingURL=index.js.map
