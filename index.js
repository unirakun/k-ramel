(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux'), require('k-redux-factory')) :
	typeof define === 'function' && define.amd ? define(['exports', 'redux', 'k-redux-factory'], factory) :
	(factory((global['k-simple-state'] = {}),global.Redux,global['k-redux-factory']));
}(this, (function (exports,redux,factory) { 'use strict';

factory = factory && factory.hasOwnProperty('default') ? factory['default'] : factory;

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
      return factory(_extends({ name: name, path: path }, options));
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

var keysConfig = {
  keyValue: [
  // actions
  ['set', 'add', 'update', 'addOrUpdate', 'replace', 'remove', 'orderBy', 'reset'],
  // selectors
  ['get', 'getBy', 'getKeys', 'getAsArray', 'getLength', 'isInitialized', 'getState']],
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
          return legacySelector.apply(undefined, arguments)(store.getState());
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

var defaultOptions = {
  hideRedux: true,
  middlewares: [],
  init: {}
};

var createStore$1 = (function (definition) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

  // options
  var innerOptions = _extends({}, defaultOptions, options);

  // this is reducer exports (action/selectors)
  var reducerTree = reduxFactory(definition);

  // this is the redux store
  var store = redux.createStore(combine(reducerTree), innerOptions.init, redux.applyMiddleware.apply(undefined, toConsumableArray(innerOptions.middlewares)));

  // convert to a contextualized version
  if (innerOptions.hideRedux) {
    reducerTree = toContext(reducerTree, store);
  }

  // exports
  return _extends({}, reducerTree, {
    getStore: function getStore() {
      return store;
    },
    getState: store.getState,
    dispatch: store.dispatch
  });
});

var keyValue = function keyValue(params) {
  return _extends({}, params, { type: 'keyValue' });
};
var simpleObject = function simpleObject(params) {
  return _extends({}, params, { type: 'simpleObject' });
};

/* eslint-disable import/prefer-default-export */

exports.createStore = createStore$1;
exports.keyValue = keyValue;
exports.simpleObject = simpleObject;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
