# k-simple-state

[![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/k-simple-state.svg)](https://greenkeeper.io/)

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
