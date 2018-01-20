!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("redux"),require("k-redux-factory")):"function"==typeof define&&define.amd?define(["exports","redux","k-redux-factory"],t):t(e["k-simple-state"]={},e.Redux,e["k-redux-factory"])}(this,function(exports,redux,factory){"use strict";factory=factory&&factory.hasOwnProperty("default")?factory.default:factory;var defineProperty=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e},_extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},slicedToArray=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,u=void 0;try{for(var a,i=e[Symbol.iterator]();!(n=(a=i.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,u=e}finally{try{!n&&i.return&&i.return()}finally{if(o)throw u}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),toConsumableArray=function(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)},reduxFactory=function(root){var subtree=function subtree(name,path){if(void 0===name)return Object.keys(root).map(function(e){return defineProperty({},e,subtree(e,""))}).reduce(function(e,t){return _extends({},e,t)},{});var nextPath=(path?path+".":"")+name,fullpath="root."+nextPath,options=eval(fullpath),type=options.type;return type?factory(_extends({name:name,path:path},options)):"function"==typeof options?options:Object.keys(options).map(function(e){return defineProperty({},e,subtree(e,nextPath))}).reduce(function(e,t){return _extends({},e,t)},{})};return subtree()},keysConfig={keyValue:[["set","add","update","addOrUpdate","replace","remove","orderBy","reset"],["get","getBy","getKeys","getAsArray","getLength","isInitialized","getState"]],simpleObject:[["set","update","reset"],["get","isInitialized"]]},toContext=function(root,store){var subcontext=function subcontext(name,path){if(void 0===name)return Object.keys(root).map(function(e){return defineProperty({},e,subcontext(e,""))}).reduce(function(e,t){return _extends({},e,t)},{});var nextPath=(path?path+".":"")+name,fullpath="root."+nextPath,reducer=eval(fullpath);if(void 0!==reducer.krfType){var keys=keysConfig[reducer.krfType],_keys=slicedToArray(keys,2),actions=_keys[0],selectors=_keys[1],actionsObject=actions.map(function(e){var t=reducer[e];return defineProperty({},e,function(){return store.dispatch(t.apply(void 0,arguments))})}).reduce(function(e,t){return _extends({},e,t)},{}),selectorsObject=selectors.map(function(e){var t=reducer[e];return defineProperty({},e,function(){return t.apply(void 0,arguments)(store.getState())})}).reduce(function(e,t){return _extends({},e,t)},{});return Object.assign(reducer,actionsObject,selectorsObject)}return Object.keys(reducer).map(function(e){return defineProperty({},e,subcontext(e,nextPath))}).reduce(function(e,t){return _extends({},e,t)},{})};return subcontext()},combine=function(e){return function e(t){var r=Object.keys(t).map(function(r){var n=t[r];return defineProperty({},r,"function"==typeof n?n:e(n))}).reduce(function(e,t){return _extends({},e,t)},{});return redux.combineReducers(r)}(e)},defaultOptions={hideRedux:!0,middlewares:[],init:{}},createStore$1=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:defaultOptions,r=_extends({},defaultOptions,t),n=reduxFactory(e),o=redux.createStore(combine(n),r.init,redux.applyMiddleware.apply(void 0,toConsumableArray(r.middlewares)));return r.hideRedux&&(n=toContext(n,o)),_extends({},n,o,{getStore:function(){return o}})},keyValue=function(e){return _extends({},e,{type:"keyValue"})},simpleObject=function(e){return _extends({},e,{type:"simpleObject"})};exports.createStore=createStore$1,exports.keyValue=keyValue,exports.simpleObject=simpleObject,Object.defineProperty(exports,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map
