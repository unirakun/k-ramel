# Reactions

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

## What is a reaction?
A reaction is a function plugged to a listener (see [listeners' documentation here](./LISTENERS.md)).\
This is where you write your logical code.\
In a reaction you can access:
 - the action that trigger your reaction (the action that your listener has caught)
 - the store (the k-ramel store, with dispatch, data, drivers, etc)
 - the drivers

A reaction is a function whom the signature is: `(action, store, drivers)`.

## Example & API
```js
import { when } from 'k-ramel'

// a reaction is a function
const reaction = () => {
  console.log('I am a reaction!')
}

// you can access the action that has triggered your reaction
const reaction = (action) => {
  const { type, payload } = action

  console.log('I am triggered by the action:', type)
  console.log('\tthe payload is:', payload)
}

// you can also access the store, to read the state, or modify it, or dispatch a new event, etc
const reaction = (action, store) => {
  const users = action.payload
  const usersSortedByName = users.sort((first, second) => first.name < second.name)

  store.ui.users.sortedByName.set(usersSortedByName)

  store.dispatch('USERS_SORTED_BY_NAME')
}

// you can access the drivers!
const reaction = (action, store, drivers) => {
  // here with a http driver
  const { http } = drivers
  // use the driver
  const users = await http('USERS').get('/api/users')
  // some log
  console.log(`I retrieved these users after ${action.type} was triggered`, users)
  // add to state
  store.data.users.set(users)

  // side node about `http` driver:
  // - you can trigger the http get,
  //   then wait for the action `ENDED` to be triggered to react to this
  //   instead of await it here
  // - http driver convert the body to JSON if application/json header
  //   is present in the response headers
}

// listeners
export default [
  // reaction should be bind to a listern
  when('SOME_ACTION')(reaction),
]
```
