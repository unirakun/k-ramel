!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react"),require("fbjs/lib/shallowEqual")):"function"==typeof define&&define.amd?define(["exports","react","fbjs/lib/shallowEqual"],e):e(t["@k-ramel/react"]={},t.React,t["fbjs/lib/shallowEqual"])}(this,function(t,e,n){"use strict";var r="default"in e?e.default:e;n=n&&n.hasOwnProperty("default")?n.default:n;var o=function(t){return t.displayName||t.name||t.constructor&&t.constructor.name||"Unknown"},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},u=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},s=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},a=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e},l={},f=function(t){return Object.keys(t).reduce(function(e,n){var r=t[n];return"function"==typeof r?e:c({},e,function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}({},n,r))},l)},p=[];t.inject=function(t){return function(l){var p,h;return h=p=function(e){function o(e,n){i(this,o);var r=a(this,(o.__proto__||Object.getPrototypeOf(o)).call(this,e,n));return r.inject=function(e){r.setState(function(n){return c({},n,{injectedProps:t&&t(r.context.store,e||r.props)||{}})})},r.first=!0,r.state={injectedProps:{}},r}return s(o,e),u(o,[{key:"componentWillMount",value:function(){var t=this;this.unsubscribe=this.context.store.subscribe(function(){t.inject()}),this.inject()}},{key:"componentWillReceiveProps",value:function(t){this.inject(t)}},{key:"shouldComponentUpdate",value:function(t,e){return!!this.first||!(n(this.props,t)&&n(f(e.injectedProps),f(this.state.injectedProps)))}},{key:"componentWillUnmount",value:function(){this.unsubscribe()}},{key:"render",value:function(){return this.first&&(this.first=!1),r.createElement(l,c({},this.props,this.state.injectedProps))}}]),o}(e.Component),p.displayName="inject("+o(l),p.contextTypes={store:function(){return null}},h}},t.provider=function(t){return function(n){var c,l;return l=c=function(e){function o(){return i(this,o),a(this,(o.__proto__||Object.getPrototypeOf(o)).apply(this,arguments))}return s(o,e),u(o,[{key:"getChildContext",value:function(){return{store:t}}},{key:"componentWillMount",value:function(){t.dispatch("@@krml/INIT")}},{key:"render",value:function(){return r.createElement(n,this.props)}}]),o}(e.Component),c.displayName="provider("+o(n)+")",c.childContextTypes={store:function(){return null}},l}},t.listen=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,n=arguments[1];return function(c){var l,f,p=function(t){var e=(t?">":"")+(t||"");return function(t){return"@@krm/LISTENERS>"+t+e}}(n);return f=l=function(e){function n(){return i(this,n),a(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return s(n,e),u(n,[{key:"componentWillMount",value:function(){var e=this.context.store;e.listeners.add(t),e.dispatch(p("ADDED"))}},{key:"componentWillUnmount",value:function(){var e=this.context.store;e.dispatch(p("REMOVING")),e.listeners.remove(t)}},{key:"render",value:function(){return r.createElement(c,this.props)}}]),n}(e.Component),l.displayName="listen("+o(c),l.contextTypes={store:function(){return null}},f}},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=index.js.map
