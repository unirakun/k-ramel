!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("k-ramel")):"function"==typeof define&&define.amd?define(["k-ramel"],e):(r=r||self)["@k-ramel/driver-form"]=e(r.kRamel)}(this,function(r){"use strict";function e(r,e,n){return e in r?Object.defineProperty(r,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):r[e]=n,r}function n(r){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},u=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(u=u.concat(Object.getOwnPropertySymbols(t).filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable}))),u.forEach(function(n){e(r,n,t[n])})}return r}return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},u=t.path,o=void 0===u?"form":u,i=t.getState,f=void 0===i?function(r){return r.form}:i,c=t.key,a=void 0===c?"@@form-name":c;return{getReducer:function(){return{path:o,reducer:{values:r.types.keyValue({key:a}),errors:r.types.keyValue({key:a})}}},getDriver:function(r){var t=f(r);return Object.assign(function(r){return n({},function(r){return function(t){return function(u){var o=function(o){return function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return t[o].addOrUpdate(n(e({},r,u),i))}};return{set:o("values"),setErrors:o("errors"),clearErrors:function(){return t.errors.reset(u)},update:function(n){return function(o){var i;return t.values.update((e(i={},r,u),e(i,n,o),i))}},remove:function(){t.values.remove(u),t.errors.remove(u)}}}}}(a)(t)(r),function(r){return function(e){return function(t){var u=function(u){return function(o){var i=e[u].get(t);if(!i)return o?"":{};if(!o&&i){var f=n({},i);return delete f[r],f}var c=i[o];return null==c?"":c}};return{exists:function(){return!!e.values.get(t)},get:u("values"),getErrors:u("errors")}}}}(a)(t)(r))},function(r){return function(t){var u=function(u){return function(o){return t[u].addOrUpdate(o.map(function(t){var u=t.name;return n({},t.values,e({},r,u))}))}};return{set:u("values"),setErrors:u("errors"),clearErrors:t.errors.remove,remove:function(r){t.values.remove(r),t.errors.remove(r)}}}}(a)(t),function(r){return{find:function(e){return r.values.getKeys().filter(function(r){return r.match(e)})}}}(t))}}}});
