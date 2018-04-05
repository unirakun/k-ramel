import React, { createContext, Component } from 'react';
import shallowEqual from 'fbjs/lib/shallowEqual';

var getWrappedDisplayName = (function (Component$$1) {
  return Component$$1.displayName || Component$$1.name || Component$$1.constructor && Component$$1.constructor.name || 'Unknown';
});

// this is a singleton :(
var context = void 0;

var createContext$1 = (function () {
  if (!context) context = createContext();
  return context;
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

var getDerivedStateFromProps = function getDerivedStateFromProps(injectFunction) {
  return function (nextProps, prevState) {
    var store = prevState.store;

    // get props derivated from redux state

    var injectedProps = injectFunction(store, nextProps.ownProps, store.drivers);

    console.log('get derivated');
    // no modifications ?
    if (shallowEqual(withoutFunctions(prevState.injectedProps), withoutFunctions(injectedProps))) return null;

    return _extends({}, prevState, { injectedProps: injectedProps, state: store.getState() });
  };
};

var wrapper = function wrapper(injectFunction) {
  return function (Component$$1) {
    var _class, _temp;

    return _temp = _class = function (_React$Component) {
      inherits(_class, _React$Component);

      function _class(props) {
        classCallCheck(this, _class);

        var _this = possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        var store = props.store;


        _this.mounted = false;
        _this.state = getDerivedStateFromProps(injectFunction)(_this.props, {
          // needed for first call (where we shallow compare old and new one)
          injectedProps: defaultObject,
          // store needed to call injectFunction
          store: store
        });

        console.log('constructor', Component$$1.displayName);
        return _this;
      }

      createClass(_class, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          console.log('didmount', Component$$1.displayName);

          var store = this.props.store;


          this.unsubscribe = store.subscribe(function () {
            console.log('subscribe', Component$$1.displayName);
            if (_this2.state.state !== store.getState()) {
              var newState = getDerivedStateFromProps(injectFunction)(_this2.props, _this2.state);
              console.log('get derivated - subscribe', Component$$1.displayName);

              if (newState !== null) {
                if (!_this2.mounted) _this2.state = newState;else _this2.setState(newState);
              }
            }
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          console.log('unmount');
          this.unsubscribe();
        }
      }, {
        key: 'render',
        value: function render() {
          var _state = this.state,
              ownProps = _state.ownProps,
              injectedProps = _state.injectedProps;


          this.mounted = true;

          return React.createElement(Component$$1, _extends({}, ownProps, injectedProps));
        }
      }]);
      return _class;
    }(React.Component), _class.getDerivedStateFromProps = getDerivedStateFromProps(injectFunction), _temp;
  };
};

var inject = (function (injectFunction) {
  var _createContext = createContext$1(),
      Consumer = _createContext.Consumer;

  var withInjectFunction = wrapper(injectFunction);

  return function (Component$$1) {
    var WrappedComponent = withInjectFunction(Component$$1);

    var WithConsumer = function WithConsumer(props) {
      return React.createElement(
        Consumer,
        null,
        function (store) {
          console.log('new store from context', WithConsumer.displayName);
          return React.createElement(WrappedComponent, { ownProps: props, store: store });
        }
      );
    };

    WithConsumer.displayName = 'inject(' + getWrappedDisplayName(Component$$1);

    console.log('hoc', WithConsumer.displayName);

    return WithConsumer;
  };
});

/* eslint-disable import/prefer-default-export */

var provider = (function (store) {
  var _createContext = createContext$1(),
      Provider = _createContext.Provider;

  return function (WrappedComponent) {
    var _class, _temp;

    return _temp = _class = function (_Component) {
      inherits(_class, _Component);

      function _class() {
        classCallCheck(this, _class);
        return possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
      }

      createClass(_class, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          store.dispatch('@@krml/INIT');
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(
            Provider,
            { value: store },
            React.createElement(WrappedComponent, this.props)
          );
        }
      }]);
      return _class;
    }(Component), _class.displayName = 'provider(' + getWrappedDisplayName(WrappedComponent) + ')', _temp;
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
          return React.createElement(WrappedComponent, this.props);
        }
      }]);
      return _class;
    }(Component), _class.displayName = 'listen(' + getWrappedDisplayName(WrappedComponent), _class.contextTypes = {
      store: function store() {
        return null;
      } // this is to avoid importing prop-types
    }, _temp;
  };
});

export { inject, provider, listen };
//# sourceMappingURL=index.es.js.map
