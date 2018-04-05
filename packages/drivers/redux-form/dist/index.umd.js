(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('redux-form'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['redux-form', 'lodash'], factory) :
  (global['@k-ramel/driver-redux-form'] = factory(global.reduxform,global._));
}(this, (function (reduxform,lodash) { 'use strict';

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

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  // actions of redux-form
  var actionNames = ['arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'autofill', 'blur', 'change', 'clearAsyncError', 'clearSubmitErrors', 'clearFields', 'destroy', 'focus', 'initialize', 'registerField', 'reset', 'resetSection', 'setSubmitFailed', 'setSubmitSucceeded', 'startAsyncValidation', 'startSubmit', 'stopSubmit', 'stopAsyncValidation', 'submit', 'touch', 'unregisterField', 'untouch'];

  var wrapAction = function wrapAction(dispatch, name, actionName) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return dispatch(reduxform[actionName].apply(reduxform, [name].concat(args)));
    };
  };

  var actions = (function (_ref) {
    var dispatch = _ref.dispatch;
    return function (name) {
      return actionNames.reduce(function (acc, cur) {
        return _extends(defineProperty({}, cur, wrapAction(dispatch, name, cur)), acc);
      }, {});
    };
  });

  var _this = undefined;

  var _asyncSubmit = function _asyncSubmit(name, _ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function () {
      var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(callback) {
        for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          options[_key - 1] = arguments[_key];
        }

        var res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch(reduxform.startSubmit(name));
                _context.next = 3;
                return callback.apply(undefined, toConsumableArray(options));

              case 3:
                res = _context.sent;

                if (reduxform.isSubmitting(name)(getState())) dispatch(reduxform.stopSubmit(name));
                return _context.abrupt('return', res);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }();
  };

  // custom actions
  var customActions = (function (store) {
    return function (name) {
      return {
        asyncSubmit: function asyncSubmit(callback) {
          for (var _len2 = arguments.length, options = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            options[_key2 - 1] = arguments[_key2];
          }

          return _asyncSubmit(name, store).apply(undefined, [callback].concat(options));
        }
      };
    };
  });

  // selectors of redux-form
  var selectorNames = ['getFormValues', 'getFormInitialValues', 'getFormSyncErrors', 'getFormMeta', 'getFormAsyncErrors', 'getFormSyncWarnings', 'getFormSubmitErrors', 'getFormError', 'isDirty', 'isPristine', 'isValid', 'isInvalid', 'isSubmitting', 'hasSubmitSucceeded', 'hasSubmitFailed'];

  // selectors without parameters
  var selectorNamesWithoutParameter = ['getFormNames'];

  var wrapSelector = function wrapSelector(getState, getFormState, name, selectorName) {
    return function () {
      return reduxform[selectorName](name, getFormState)(getState());
    };
  };

  var selectors = (function (getFormState) {
    return function (_ref) {
      var getState = _ref.getState;
      return function (name) {
        return _extends({}, selectorNames.reduce(function (acc, cur) {
          return _extends(defineProperty({}, cur, wrapSelector(getState, getFormState, name, cur)), acc);
        }, {}), selectorNamesWithoutParameter.reduce(function (acc, cur) {
          return _extends(defineProperty({}, cur, function () {
            return reduxform[cur](getFormState)(getState());
          }), acc);
        }, {}));
      };
    };
  });

  var reduxForm = (function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$path = _ref.path,
        path = _ref$path === undefined ? 'form' : _ref$path;

    return {
      getDriver: function getDriver(store) {
        return function (name) {
          return _extends({}, actions(store)(name), selectors(function (state) {
            return lodash.get(state, path);
          })(store)(name), customActions(store)(name));
        };
      },
      getReducer: function getReducer() {
        return {
          path: path,
          reducer: reduxform.reducer
        };
      }
    };
  });

  return reduxForm;

})));
//# sourceMappingURL=index.umd.js.map
