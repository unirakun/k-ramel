# Store

<p align="center">
  main navigation
  [&nbsp;
    <a href="../../../README.md#how-to-use-k-ramel">ecosystem documentation</a>&nbsp;|&nbsp;
    <a href="../README.md#how-to-use-k-ramel">core documentation</a>&nbsp;|&nbsp;
    <a href="../../../README.md#modules">modules</a>
  &nbsp;]
  <br />
  sub navigation
  [&nbsp;
    <a href="./LISTENERS.md">listeners</a>&nbsp;|&nbsp;
    <a href="./REACTIONS.md">reactions</a>&nbsp;|&nbsp;
    <a href="./DRIVERS.md">drivers</a>&nbsp;|&nbsp;
    <a href="./STORE.md">store</a>
  &nbsp;]
</p>

## What is a store?
You can read this page from Redux if you need to understand what is a Redux store: [documentation from Redux](https://redux.js.org/api/store).
> A store holds the whole state tree of your application.\
> The only way to change the state inside it is to dispatch an action on it.

`k-ramel` store wrap the Redux one. This is convenient to have a simpler `createStore` function, and to add our pre-builds `types` (reducers).\
With `k-ramel` we want that there is no need to right a custom reducer, and we want to put our logical code into [reactions](./REACTIONS.md), **NOT** into reducers.\
Also note that the `redux-devtools` is activated by default.

## Example & API
### Types
Our types are based on the [k-redux-factyory ones](https://github.com/alakarteio/k-redux-factory/blob/master/TYPES.md):

```js
import { types } from 'k-ramel'

// types can create reducers (with its actions and selectors):
// - an object
types.object()
// - a string
types.strign()
// - a boolean
types.bool()
// - an array
types.array()
// - a number
types.number()
// - a keyValue map
types.keyValue()
```

### Create store
```js
import { createStore, types } from 'k-ramel'

const store = createStore(
  // store definition
  // note that we don't use `combineReducers`, k-ramel do it itself
  {
    data: {
      users: types.keyValues(), // we create a key value reducer, the key is `id` by default
      fruits: types.keyValues({ key: 'name' }), // we create a key value reducer, the key is the `name` of a fruit
    },
    ui: {
      selectedUserId: types.string(), // a simple string to store the selected user id
      // you can add our custom reducer (your redux ones) where you want :)
      // - but not that automatic `dispatch` and `getState` won't work
      // - you will have to call them manually:
      //    * store.dispatch({ type: 'MY_CUSTOM_ACTION_REDUCER' })
      //    * store.getState().ui.customState
    },
  },
  // store options
  {
    drivers: {}, // look at driver documentation
    listeners: [], // look a listeners documentation
  },
)
```

### Ask for mutation
Don't forget this is a redux store that k-ramel wraps.\
So you need to dispatch action for reducer to mutate state.\
If you use `types` from k-ramel, then the action is automatically dispatched for you.

```js
// you create the store by calling `createStore` in this file (see the code above)
import store from './store'

// this is our raw data, you can retrieve it via an API (see reactions and driver documentation)
const users = [
  { id: 'first-id', name: 'Gérard', age: 12 },
  { id: 'second-id', name: 'Bérangère', age: 18 },
]

// here k-ramel calls the appropriate dispatch by itself
// meaning that the store is mutated after this call
store.data.users.set(users)
// now, you can retrieve users from the store
console.log(store.getState().data.users())
// but, you can do better by calling our internal selectors (if you use our types)
// the `getState` that you know is called internally:
// - retrieve the user whom id is `first-id`
console.log(store.data.users.get('first-id'))
// - retrieve all users array
console.log(store.data.users.getAsArray())
```

## API
store API is simple, we use [Redux one](https://redux.js.org/api/store):
 - [dispatch](https://redux.js.org/api/store#dispatch-action)
 - [getState](https://redux.js.org/api/store#getstate)
 - [replaceReducers](https://redux.js.org/api/store#replacereducer-nextreducer)
 - [subscribe](https://redux.js.org/api/store#subscribe-listener)

and we add some of ours:
 - drivers
 - listeners
    * add
    * remove

### drivers
Access the drivers that are plugued into store when you call `createStore`.\
You can read the full [documentation here](./DRIVERS.md).

### listeners
listeners.add and listeners.remove are used when you need to hot load listeners (and reactions), or remove them.\
You can read the full [documentation here](./LISTENERS.md).
