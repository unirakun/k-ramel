(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global['@k-ramel/driver-http'] = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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

  var _this = undefined;

  var dispatchFactory = function dispatchFactory(store) {
    return function (name) {
      return function (method) {
        return function (event, payload, status, fetch) {
          return store.dispatch({
            type: '@@http/' + name + '>' + method + '>' + event,
            payload: payload,
            status: status,
            fetch: fetch
          });
        };
      };
    };
  };

  var getDriver = function getDriver(store) {
    var innerOptions = {};

    var driver = function driver(name) {
      var ownFetch = function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
          for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var _options$method, method, appliedHeaders, appliedOptions, dispatch, data, raw, fetchArgs, _ref2, _raw, status;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // options
                  _options$method = options.method, method = _options$method === undefined ? 'GET' : _options$method;
                  appliedHeaders = _extends({}, innerOptions.headers, options.headers);
                  appliedOptions = _extends({}, innerOptions, options, { headers: appliedHeaders
                    // dispatcher
                  });
                  dispatch = dispatchFactory(store)(name)(method);

                  // request

                  data = void 0;
                  raw = void 0;
                  fetchArgs = [url, appliedOptions].concat(toConsumableArray(args));

                  dispatch('STARTED', undefined, undefined, fetchArgs);
                  _context.prev = 8;
                  _context.next = 11;
                  return (_ref2 = global || window).fetch.apply(_ref2, toConsumableArray(fetchArgs));

                case 11:
                  raw = _context.sent;

                  data = raw;

                  if (!(raw.headers && raw.headers.get('Content-Type') && raw.headers.get('Content-Type').includes('json'))) {
                    _context.next = 17;
                    break;
                  }

                  _context.next = 16;
                  return raw.json();

                case 16:
                  data = _context.sent;

                case 17:
                  _context.next = 23;
                  break;

                case 19:
                  _context.prev = 19;
                  _context.t0 = _context['catch'](8);

                  dispatch('FAILED', _context.t0, (raw || {}).status, fetchArgs);
                  return _context.abrupt('return', _context.t0);

                case 23:
                  _raw = raw, status = _raw.status;

                  if (status >= 400 || status < 200) {
                    dispatch('FAILED', data, status);
                  } else {
                    dispatch('ENDED', data, status);
                  }

                  return _context.abrupt('return', data);

                case 26:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this, [[8, 19]]);
        }));

        return function ownFetch(_x2) {
          return _ref.apply(this, arguments);
        };
      }();

      // methods helpers
      ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT'].forEach(function (method) {
        ownFetch[method.toLowerCase()] = function (url, data) {
          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          var headers = _extends({}, options.headers);
          var appliedOptions = options;

          if (data && ['object', 'array'].includes(typeof data === 'undefined' ? 'undefined' : _typeof(data))) {
            // attach data as JSON object
            var body = data;
            if (!(data instanceof FormData)) {
              headers['Content-Type'] = headers['Content-Type'] || 'application/json';
              body = JSON.stringify(data);
            }
            appliedOptions = _extends({}, appliedOptions, { body: body });
          }

          // set fetch arguments
          appliedOptions = _extends({}, appliedOptions, { method: method, headers: headers });

          return ownFetch(url, appliedOptions);
        };
      });

      return ownFetch;
    };

    // custom helpers
    driver.setCredentials = function (credentials) {
      innerOptions = _extends({}, innerOptions, { credentials: credentials });
    };
    driver.setOptions = function (options) {
      innerOptions = _extends({}, options, { headers: _extends({}, options.headers) });
    };
    driver.setAuthorization = function (authorization) {
      var headers = _extends({}, innerOptions.headers, { Authorization: authorization });
      if (!authorization) delete headers.Authorization;

      return driver.setOptions(_extends({}, innerOptions, { headers: headers }));
    };
    driver.clearAuthorization = function () {
      return driver.setAuthorization();
    };

    return driver;
  };

  var http = (function () {
    return {
      getDriver: getDriver
    };
  });

  return http;

})));
//# sourceMappingURL=index.umd.js.map
