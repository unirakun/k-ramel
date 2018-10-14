# @k-ramel/react
> React bindings for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Examples & API
### provide the store to react context
```jsx
import { provider } from '@k-ramel/react'
import store from './store' // see k-ramel documentation about building your store

const App = () => <div>My application</div>

export default provider(store)(App)
```

### map store to your components
**component.container.js**
```jsx
import { inject } from '@k-ramel/react'
import Component from './component' // your react component

/* in this example we expect that the store is build with:
  createStore({
    data: {
      users: types.keyValue(),
    },
  })
*/
// this function allow you to access:
// - the whole store
// - the props given by the parent component
// - the drivers (see driver documentation if you don't know what it is)
const mapStore = (store, ownProps, drivers) => {
  // you should return an object
  // this object represent the new props to be merged with `ownProps` from parent
  // note that props written here will override parent ones
  return {
    // data
    ...store.data.users.get(ownProps.id),
    // callback that use a driver
    // - callback are not tested upon `shouldComponentUpdate` optimisation
    onRemove: () => {
      drivers.http('USERS').delete(`/api/users/${ownProps.id}`)
    },
    // The example above would be better this way
    onRemoveBetter: () => store.dispatch({ type: '@@ui/USERS>REMOVED>CLICKED', payload: ownProps.id })
    // - then plug a reation to call the http driver
    // - this way your UI and your data management are decoupled
  },
}

export default inject(mapStore)(Component)
```

### write some logical code binded to a component
To understand this part you should first read the [listeners' documentation](../../k-ramel/doc/LISTENERS.md).

First, write your reactions:\
**component.reactions.js**
```js
export const callDeleteUser = (action, store, drivers) => {
  drivers.http('USERS').delete(`/api/users/${action.payload}`)
}

export const removeUser = (action, store) => {
  // here we will remove user from store AFTER the API respond
  // but you can do it in parallel (by writing this line into `callDeleteUser` for example)
  store.users.remove(action.payload.id)
}
```

Second, write your listeners:\
**component.listeners.js**
```js
// import listener engine
import { when } from 'k-ramel'
// import your reactions (logical code)
import { callDeleteuser, removeUser } from './component.reactions'


// react connector needs an array of listeners
export default [
  // here you can see our UI and your logical code are decupled
  // the `@@ui/USERS>REMOVED>CLICKED` is dispatched from your component (mapStore)
  when('@@ui/USERS>REMOVED>CLICKED')(callDeleteUser),
  // when the http driver has a response, it triggers a `ENDED` event
  // you can see the full http driver to see the list of events
  // note that data is already parsed from JSON
  when('@@http/USERS>DELETE>ENDED')(removeUser),
]
```

Finally, you can attach your listeners to a given component.\
One of the strategy is to attach listeners to a `Screen` of your application.\
That means that your business code is attach to a particular screen:\
***component.container.js**
```js
// this is the previous component.container we call but we add some lines on it
// to plug ours listeners (and reactions)
// - first modification is here, we import `listen` to plug our listeners
import { inject, listen /* HERE 👋 */ } from '@k-ramel/react'
import Component from './component'
// we also import our listeners 👋
import listeners from './component.listeners'

const mapStore = (store, ownProps, drivers) => {
  return {
    ...store.data.users.get(ownProps.id),
    onRemoveBetter: () => store.dispatch({ type: '@@ui/USERS>REMOVED>CLICKED', payload: ownProps.id })
  },
}

// we use `listen` as an HoC 👋
export default listen(
  listeners,  // [REQUIRED] we pass our listeners writen above 👋
  'users', // [OPTIONAL] you can pass a name to your listeners
)(inject(mapStore)(Component))
// from here, each time your component will be **mounted**:
// - an action will be dispatched: `@@krml/LISTENERS>ADDED>users` (`users` is the name we give just above)
// - the listeners are attached to the k-ramel store
// each time your component will be **unmounted££:
// - an action will be dispatched: `@@krml/LISTENERS>REMOVING>users` (`users` is the name we give just above)
// - the listeners will be removed from k-ramel store
//
// note that you can listen to `@@krml/LISTENERS>ADDED>users` in your plugued listeners
// since this action is dispatched AFTER listeners are added
// it means you can some screen initialisation for example
//
// also note that you can listen to `@@krml/LISTENERS>REMOVING>users` but you **CAN'T** trust it to reset your store
// because, by React nature, `ADDED` action from an other screen would be dispatched BEFORE the `REMOVING` one.
```
