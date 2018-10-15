# Drivers

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

## What is a driver?
A driver can access the whole store, it is used to write our side effects (accessing HistoryAPI for instance, or fetch, etc). But you can also use it to add some application wise logic, like service.

Just keep in mind that drivers can't be splited or hot loaded. The more you add logic to drivers, the more your bundle will be bloated.\
If you want to add some logic code maybe you should use `listeners` in your application instead. So you can add and remove them on the fly.\
You can access the [listeners' documentation here](./LISTENERS.md).

We use drivers to share our work too, you can find some in the [ecosystem documentation](../../../README.md#how-to-use-k-ramel).

At the beginning, our drivers was inspired by [CycleJS description](https://cycle.js.org/drivers.html).

## Example
### Creating a driver
**dumbDriver.js**
```js
export default {
  getDriver: (store) => {
    // your implementation

    // your driver API
    return {
      // the store is the k-ramel store, it means you can use others drivers (!), custom dispatch,
      // and our types wrapper
      sayHi: () => {
        // dispatch something
        store.dispatch('@@dumbDriver/HI')

        // modify state
        store.data.add({ id: Date.now(), label: 'I said hi!' })
      },
    }
  },
}
```

### Attach your new driver to the store and give it a name
**store.js**
```js
import { createStore, data } from 'k-ramel'
import dumb from './dumbDriver'

export default createStore(
  // store definitions
  {
    data: types.keyValues(),
  },
  // store options
  {
    // drivers (key/values)
    drivers: {
      dumb,
    },
  },
)
```

### Use a driver into a reaction
**listeners.js**
```js
import { when } from 'k-ramel'

// drivers API are accessible into the third argument of your reactions
const myReaction = (action, store, drivers) => {
  // get the dumb driver
  const { dumb } = drivers

  // use its API
  dumb.sayHi()
}

export default [
  when('@@krml/INIT')(myReaction),
]
```

### Attach the reaction to store (via listeners)
**store.js**
```js
import { createStore, data } from 'k-ramel'
import dumb from './dumbDriver'
import listeners from './listeners'

export default createStore(
  // store definitions
  {
    data: types.keyValues(),
  },
  // store options
  {
    // root listeners
    listeners, //////// <------ modification is here 👋
    // drivers (key/values)
    drivers: {
      dumb,
    },
  },
)
```

### You can add one of our driver to yours
To see our supported drivers, you can go to the [ecosystem documentation](../../../README.md#how-to-use-k-ramel).

Here is an example with our form driver:

**store.js**
```js
import { createStore, data } from 'k-ramel'
import form from '@k-ramel/driver-form'
import dumb from './dumbDriver'
import listeners from './listeners'

export default createStore(
  // store definitions
  {
    data: types.keyValues(),
  },
  // store options
  {
    // root listeners
    listeners,
    // drivers (key/values)
    drivers: {
      form, //////// <------ modification is here 👋
      dumb,
    },
  },
)
```

## API
```js
// create a new driver
// this is an object that MUST have `getDriver` and returns an API
export default {
  // [REQUIRED]
  // getDriver is the must have
  getDriver: (store) => {
    // your implementations
    // [...]

    // your API
    return {
      set: () => {},
      get: () => {},
      // [...]
    }
  },
  // [OPTIONAL]
  // you can also add reducers to the store definitions via drivers
  // k-ramel will try to call `getReducer`, and if it returns something try to
  // add your reducer to the given path.
  getReducer: () => {
    return {
      // give a path to attach your reducer
      // it can be a simple dot notation
      path: 'ui.form',
      // give your reducers it can be from `k-ramel` types or your custom ones.
      // it has same rules that the store definition you can write into `createStore`
      // here two reducers would be added to the ui.form path:
      //  - ui.form.values (which is a keyValues from k-ramel)
      //  - ui.form.errors (which is a keyValues from k-ramel)
      reducers: {
        values: types.keyValues(),
        errors: types.keyValues(),
      },
    }
  },
  // [OPTIONAL]
  // this is also possible to have an initialisation function
  // (in `k-redux-router` we use it to retrieve a route from URL on first load for example)
  // you can access the store from here, this is fully initialized, so you can:
  //  - use an other driver (!)
  //  - access store via k-ramel types decorators (example: state.data.get() / state.data.add({}))
  init: (store) => {
    // your implementation
    // [...]

    // k-ramel doesn't use the returns statement of the init hook
  },
  // [OPTIONAL]
  // and last, you can give a redux enhancer if needed (we use it into `k-redux-router` since we need a middleware)
  getEnhancer: () => {
    // here you can use `compose` and `enhanceMiddleware` from redux if needed
    // this function, if it exists, should returns only one enhancer,
    // it will be composed to the others redux enhancers by k-ramel.
  },
}
```
