# k-ramel
## API

### createStore(<store_description>, \<options>)
| parameter | required | description |
|---|---|---|
| <store_description>| required | object describing your store, it can be nested |
| [\<options>](#options) | optional | all options you may want to override |

#### options
All options are optionals to keep the default usage as simple as possible.

| key | type | default | description |
|---|---|---|---|
| listeners | `array` | `undefined` | array of all listeners. Listeners are a big part of this lib, you can [click here for detail](./doc/LISTENERS.md). |
| devtools | `boolean` | `undefined` | [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension) is activated. If the value is `undefined` (default value) then devtools will be desactivated in production build (NODE_ENV === 'production'). |
| hideRedux | `boolean` | `true` | actions and selectors from [`k-redux-factory`](https://github.com/alakarteio/k-redux-factory) are used without specifying `dispatch` or `getState`. |
| enhancer | redux enhancer | `undefined` | usual `compose` and `applyMiddlare` you already use with Redux can be injected here (like router, redux-saga, etc). <br />`compose` and `applyMiddleware` from Redux are exposed by the lib. To use them:<br /> ```import { compose, applyMiddleware } from 'k-ramel'```. |
| init | `object` | `undefined` | the default value of your store. |
