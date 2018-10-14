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

## Example & API
```js
// `when` is our HoF, this a helper to listen to specific function from the redux eventbus
import { when } from 'k-ramel'

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
```
