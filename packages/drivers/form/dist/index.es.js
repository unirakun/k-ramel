import{types}from"k-ramel";var defineProperty=function(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r},_extends=Object.assign||function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},actions=function(r){return function(e){return function(t){var n=function(n){return function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return e[n].addOrUpdate(_extends(defineProperty({},r,t),o))}};return{set:n("values"),setErrors:n("errors"),clearErrors:function(){return e.errors.reset(t)},onChange:function(n){return function(o){var u;return e.values.update((defineProperty(u={},r,t),defineProperty(u,n,o),u))}},remove:function(){e.values.remove(t),e.errors.remove(t)}}}}},selectors=function(r){return function(e){return function(t){var n=function(n){return function(o){var u=e[n].get(t);if(!o&&u){var i=_extends({},u);return delete i[r],i}return u&&u[o]||""}};return{exists:function(){return!!e.values.get(t)},get:n("values"),getErrors:n("errors")}}}},utils=function(r){var e=function(e){return r.values.getKeys().filter(function(r){return r.match(e)})},t=function(e){r.values.remove(e),r.errors.remove(e)};return{find:e,removeEach:function(r){return e(r).forEach(t)}}},form=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.path,t=void 0===e?"form":e,n=r.getState,o=void 0===n?function(r){return r.form}:n,u=r.key,i=void 0===u?"@@form-name":u;return{getReducer:function(){return{path:t,reducer:{values:types.keyValue({key:i}),errors:types.keyValue({key:i})}}},getDriver:function(r){var e=o(r);return Object.assign(function(r){return _extends({},actions(i)(e)(r),selectors(i)(e)(r))},utils(e))}}};export default form;
