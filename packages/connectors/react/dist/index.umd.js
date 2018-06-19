(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('fbjs/lib/shallowEqual')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'fbjs/lib/shallowEqual'], factory) :
  (factory((global['@k-ramel/react'] = {}),global.React,global['fbjs/lib/shallowEqual']));
}(this, (function (exports,React,shallowEqual) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;
  shallowEqual = shallowEqual && shallowEqual.hasOwnProperty('default') ? shallowEqual['default'] : shallowEqual;

  var getWrappedDisplayName = (function (Component) {
    return Component.displayName || Component.name || Component.constructor && Component.constructor.name || 'Unknown';
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var defaultObject = {};
  var withoutFunctions = function withoutFunctions(object) {
    return Object.keys(object).reduce(function (acc, key) {
      var value = object[key];
      if (typeof value === 'function') return acc;
      return _extends({}, acc, defineProperty({}, key, value));
    }, defaultObject);
  };

  var inject = (function (injectFunction) {
    return function (WrappedComponent) {
      var _class, _temp;

      return _temp = _class = function (_Component) {
        inherits(_class, _Component);

        function _class(props, context) {
          classCallCheck(this, _class);

          var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props, context));

          _this.inject = function (nextProps) {
            if (!_this.store) return;

            _this.setState(function (state) {
              return _extends({}, state, {
                injectedProps: injectFunction ? injectFunction(_this.store, nextProps || _this.props, _this.store.drivers) || defaultObject : defaultObject
              });
            });
          };

          _this.first = true;
          _this.state = {
            injectedProps: {}
          };
          return _this;
        }

        createClass(_class, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            var _this2 = this;

            var store = this.context.store;


            if (!store) {
              var bold = 'font-weight: bolder; font-style: italic;';
              // eslint-disable-next-line no-console
              console.error('[k-ramel/react] Error in %cinject%c for the component %c' + getWrappedDisplayName(WrappedComponent) + '%c\n' + '\t> The store needs to be provided by an ancestor of this component.\n' + '\t> You can use %cprovider%c from %c@k-ramel/react%c or %cProvider%c from %creact-redux%c.\n\n' + 'Check the documentation for an example at https://github.com/alakarteio/k-ramel#connect-it-with-reactjs\n', bold, '', bold, '', bold, '', bold, '', bold, '', bold, '');
              return;
            }
            this.store = store;

            // run in once
            this.inject();

            // subscribe
            this.unsubscribe = store.subscribe(function () {
              _this2.inject();
            });
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            this.inject(nextProps);
          }
        }, {
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState) {
            if (this.first) return true;

            return !(shallowEqual(this.props, nextProps) && shallowEqual(withoutFunctions(nextState.injectedProps), withoutFunctions(this.state.injectedProps)));
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.store = undefined;
            this.unsubscribe();
          }
        }, {
          key: 'render',
          value: function render() {
            if (this.first) this.first = false;

            return React__default.createElement(WrappedComponent
            /* this is parent props */
            , _extends({}, this.props, this.state.injectedProps));
          }
        }]);
        return _class;
      }(React.Component), _class.displayName = 'inject(' + getWrappedDisplayName(WrappedComponent), _class.contextTypes = {
        store: function store() {
          return null;
        } // this is to avoid importing prop-types
      }, _temp;
    };
  });

  /* eslint-disable import/prefer-default-export */

  var provider = (function (store) {
    return function (WrappedComponent) {
      var _class, _temp;

      return _temp = _class = function (_Component) {
        inherits(_class, _Component);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: 'getChildContext',
          value: function getChildContext() {
            return { store: store };
          }
        }, {
          key: 'componentWillMount',
          value: function componentWillMount() {
            store.dispatch('@@krml/INIT');
          }
        }, {
          key: 'render',
          value: function render() {
            return React__default.createElement(WrappedComponent, this.props);
          }
        }]);
        return _class;
      }(React.Component), _class.displayName = 'provider(' + getWrappedDisplayName(WrappedComponent) + ')', _class.childContextTypes = {
        store: function store() {
          return null;
        } // this is to avoid importing prop-types
      }, _temp;
    };
  });

  var defaultListeners = [];

  var toActionFactory = function toActionFactory(name) {
    var suffix = '' + (name ? '>' : '') + (name || '');
    return function (type) {
      return '@@krml/LISTENERS>' + type + suffix;
    };
  };

  var listen = (function () {
    var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultListeners;
    var name = arguments[1];
    return function (WrappedComponent) {
      var _class, _temp;

      var toAction = toActionFactory(name);

      return _temp = _class = function (_Component) {
        inherits(_class, _Component);

        function _class() {
          classCallCheck(this, _class);
          return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }

        createClass(_class, [{
          key: 'componentWillMount',
          value: function componentWillMount() {
            var store = this.context.store;


            store.listeners.add(listeners);
            store.dispatch(toAction('ADDED'));
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            var store = this.context.store;


            store.dispatch(toAction('REMOVING'));
            store.listeners.remove(listeners);
          }
        }, {
          key: 'render',
          value: function render() {
            return React__default.createElement(WrappedComponent, this.props);
          }
        }]);
        return _class;
      }(React.Component), _class.displayName = 'listen(' + getWrappedDisplayName(WrappedComponent), _class.contextTypes = {
        store: function store() {
          return null;
        } // this is to avoid importing prop-types
      }, _temp;
    };
  });

  exports.inject = inject;
  exports.provider = provider;
  exports.listen = listen;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
