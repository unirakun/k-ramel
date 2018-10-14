# Listeners

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

## What is a listener?
You can listen to actions from the redux eventbus with what we call `listeners`.\
A listener is a predicate wrapped into the `when` function (this is a HoF _Higher order Function_).
With a listener you call what we call a `reaction`.

You listen (using a `listener` (`when` function)) a specific action from the redux eventbus, then you `react` to it via an other function that we call a reaction.

You can look at [reactions documentation here](./REACTIONS.md).

Note that listeners can be hot loaded in your store.\
You can use a connector (like `@k-ramel/react`) or you can mannually call `store.listeners.add` (and `store.listeners.remove`).\
To find the documentation about connectors, feel free to look at the [ecosystem documentation](../../../README.md#modules).

## Example & API
```js
// `when` is our HoF, this a helper to listen to specific function from the redux eventbus
import { when, createStore, types } from 'k-ramel'

// dummy reaction for the listener documentation purpose
const reaction = () => { console.log('I am the reaction') }

// listeners are array than we can attach to the store
// - we can attach and detach them from the store what the application live (hot connection)
// - we can attach (and NOT detach) them when we create the store, this is our root listeners (cold connection)
const listeners = [
  // k-ramel will call your wrapped `reaction` function when:
  // - an action whom the type is equal to 'AN_EVENT' (action.type === 'AN_EVENT') is dispatched to redux
  when('AN_EVENT')(reaction),
  // - an action whom the type finish by 'EVENT' (/.*EVENT/.test(action.type)) is dispatched to redux
  when(/.*EVENT/)(reaction),
  // - an action whom the type is equal to 'AN_EVENT' and payload is true is dispatched to redux
  when(action => (action.type === 'AN_EVENT' && action.payload === true))(reaction),
  // - this is the same as previous, but using the `and` predicate builtin `when` function
  when('AN_EVENT', action => action.payload === true)(reaction),
  // - you can't write `or` predicate with when, you have to write 2 when binded to the same reaction
  // - this is a design choice, because we don't want `when` to be hard to read
  when('AN_EVENT')(reaction), // 1
  when('OTHER_EVENT')(reaction), // or 2
]

// create a store with listeners at root level
const store = createStore(
  {
    data: types.keyValues(),
  },
  {
    // here we attach our previous listeners to the store root level
    // we can't detach them, and listeners will be triggered in the all store lifespan
    listeners,
  }
)

// you can alors attach your listener when the applications runs
// this is convenient to split your logical code
// since you can detach them too!
store.listeners.add(listeners)
// and remove them
store.listeners.remove(listeners)

// k-ramel use your array reference as key to find it and then remove it,
// it means that YOU DON'T WANT to mutate it!

```
