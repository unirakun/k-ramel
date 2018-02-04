# k-simple-state

State manager for your components apps, the safe and easy way.

[![CircleCI](https://circleci.com/gh/alakarteio/k-simple-state.svg?style=shield)](https://circleci.com/gh/alakarteio/k-simple-state) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-simple-state/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-simple-state?branch=master) [![NPM Version](https://badge.fury.io/js/k-simple-state.svg)](https://www.npmjs.com/package/k-simple-state)
[![Size](http://img.badgesize.io/alakarteio/k-simple-state/master/index.js.svg)]()


## Contents
 - [Purpose](#purpose)
 - [Why ?](#why)
 - [Installation](#installation)
 - [API](#api)
 - [Examples](#examples)

## Purpose
TODO

## Why
TODO

## Installation
 - `yarn add k-simple-state`
 - `npm install --save k-simple-state`

## API
### createStore(<store_description>, <options>)
| parameter | required | description |
|---|---|---|
| [<store_description>](#store_description) | required | object describing your store, it can be nested |
| [<options>](#options) | optional | all options you may want to override |

#### store_description
Here a simple example of store description:
```js
{
  data: {
    todos: { type: 'keyValue', key: 'id' },
  },
  newTodo: { type: 'simpleObject' },
}
```

- TODO: with custom reducer
- TODO: explain keyValue/simpleObject by referencing k-redux-factory
- TODO: with helpers (keyValue()/simpleObject())

#### options
All options are optionals to keep the default usage as simple as possible.
| key | type | default | description |
|---|---|---|---|
| listeners | `array` | `undefined` | array of all listeners. Listeners are a big part of this lib, you can [click here for detail](#TODO). |
| devtools | `boolean` | `true` | [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension) is activated. |
| hideRedux | `boolean` | `true` | Actions and selectors from [`k-redux-factory`](https://github.com/alakarteio/k-redux-factory) are used without specifying `dispatch` or `getState` |
| enhancer | redux enhancer | `undefined` | Usual `compose` and `applyMiddlare` you already use with Redux can be injected here (like router, redux-saga, etc). <br />`compose` and `applyMiddleware` from Redux are exposed by the lib. To use them:<br /> ```js import { compose, applyMiddleware } from 'k-simple-state'```. |
| init | `object` | `undefined` | the default value of your store. |

#### listeners
TODO

## Examples
Full example
```es6
const { createState } = require('k-simple-state')

const saveToLocalStorage = store => next => (action) => {
  // dispatch action
  const res = next(action)

  // save store to localStorage
  window.localStorage.setItem('redux-store', JSON.stringify(store.getState()))

  // return action for next middlewares
  return res
}

const state = createState({
  data: {
    todos: { type: 'simpleObject' },
    context: { type: 'keyValue', key: 'key' },
  },
  ui: {
    bla: { type: 'simpleObject' },
    testCustomReducer: (state, action) => {
      if (!state) return 'oui'
      if (action.type === 'testCustom') return action.payload
      return state
    },
  },
  config: state => state || {},
}, {
  hideRedux: true,
  middlewares: [saveToLocalStorage],
  init: {
    config: { this: 'is', from: { init: 'state' } },
  },
})

state.ui.bla.set({ one: 'object', so: 'cool', right: true })
state.dispatch(state.ui.bla.set({ this: 'is', with: 'redux' }))
state.dispatch({ type: 'testCustom', payload: 'ok ça marche' })
```
