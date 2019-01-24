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

### types
```js
import { types } from 'k-ramel'
```

You can use one of our types as reducers (+ selectors and reactions).
Types are:
 - `types.object()`: a simple object, default is `{}`
 - `types.string()`: a simple string, default is `''`
 - `types.bool()`: a simple boolean, default is `false`
 - `types.array()`: a simple array, default is `[]`
 - `types.number()`: a simple number, default is `0`
 - `types.keyValue()`: a key value collection

You can find all associated selectors and actions for each types in the [k-redux-factory documentation](https://github.com/alakarteio/k-redux-factory/blob/master/TYPES.md).

### when(\<matcher1>, \<matcher2>(, ...))(\<reaction>)
```js
import { when } from 'k-ramel'
```

When are used to listen to redux eventbus, and then react to it.
A `matcher` can be one of these types:
 - a `string`: in which case the action.type will be tested against your given string
    - ex: `when('@@krml/INIT')` will react to action `{ type: '@@krml/INIT', payload: 'whatever' }`
 - a `regexp`: in which case the action.type will be tested against your given regexp
    - ex: `when(/@@krml.*/)` will react to action `{ type: '@@krml/WHATEVER', payload: 'whatever' }`
 - a `function(action, store)`: in which case the function should return a truthy value to trigger the reaction.

A `reaction` must follow this signature: `(action, store, drivers) `

#### Exemple 1: with a string
In this example we react to the k-ramel initialisation to load the **Adventure time** show description from **TVMAZE**.

```js
when('@@krml/INIT')((action, store, drivers) => {
  drivers.http('TVMAZE').get('http://api.tvmaze.com/shows/290')
})
```

#### Exemple 2: with a regexp
In this example we react to the http driver response to retrieve **Adventure time** show description that the API responds.
We take care of looking for action.status so we make sure the request is ok!

```js
when(/@@http\/.*TVMAZE.*/)((action, store) => {
  // if the request fails, we do nothing
  if (action.status < 200 || action.status >= 400) return

  // in other cases we register our show description to the store
  store.show.set(action.payload)
})
```

#### Example 3: with a function
We are doing the same example given previously but using a function matcher.
 - The first matcher used is a regexp (like previous exemple): we ensure to process a HTTP action.
 - The second matcher is a function to ensure the request has not failed!
    * Then, we don't need to check this in our reaction



```js
when(
  /@@http\/.*TVMAZE.*/,
  (action) => (action.status >= 200 && action.status < 400),
)((action, store) => {
  // we register our show description to the store
  store.show.set(action.payload)
})
```

#### Example 4: with a function, use the store
In the function matcher you have access to the store.
It can be useful when you want to match a specific Redux action since our actions types are published. (if you use `types`).

```js
when((action, store) => action.type === store.show.SET)(() => { console.log('show is set!') })
```
