import{types}from"k-ramel";var defineProperty=function(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r},_extends=Object.assign||function(r){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r},actions=function(r){return function(e){return function(t){var n=function(n){return function(){var u=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return e[n].addOrUpdate(_extends(defineProperty({},r,t),u))}};return{set:n("values"),setErrors:n("errors"),clearErrors:function(){return e.errors.reset(t)},update:function(n){return function(u){var o;return e.values.update((defineProperty(o={},r,t),defineProperty(o,n,u),o))}},remove:function(){e.values.remove(t),e.errors.remove(t)}}}}},bulkActions=function(r){return function(e){var t=function(t){return function(n){return e[t].addOrUpdate(n.map(function(e){var t=e.name,n=e.values;return _extends({},n,defineProperty({},r,t))}))}};return{set:t("values"),setErrors:t("errors"),clearErrors:e.errors.remove,remove:function(r){e.values.remove(r),e.errors.remove(r)}}}},selectors=function(r){return function(e){return function(t){var n=function(n){return function(u){var o=e[n].get(t);if(!u&&o){var i=_extends({},o);return delete i[r],i}return o&&o[u]||void 0}};return{exists:function(){return!!e.values.get(t)},get:n("values"),getErrors:n("errors")}}}},utils=function(r){return{find:function(e){return r.values.getKeys().filter(function(r){return r.match(e)})}}},form=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.path,t=void 0===e?"form":e,n=r.getState,u=void 0===n?function(r){return r.form}:n,o=r.key,i=void 0===o?"@@form-name":o;return{getReducer:function(){return{path:t,reducer:{values:types.keyValue({key:i}),errors:types.keyValue({key:i})}}},getDriver:function(r){var e=u(r);return Object.assign(function(r){return _extends({},actions(i)(e)(r),selectors(i)(e)(r))},bulkActions(i)(e),utils(e))}}};export default form;
