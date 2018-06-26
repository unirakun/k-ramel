# k-ramel

State manager for your components apps, the safe and easy way.

[![CircleCI](https://circleci.com/gh/alakarteio/k-ramel.svg?style=shield)](https://circleci.com/gh/alakarteio/k-ramel) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-ramel/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-ramel?branch=master) [![NPM Version](https://badge.fury.io/js/k-ramel.svg)](https://www.npmjs.com/package/k-ramel) [![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/k-ramel.svg)](https://greenkeeper.io/)

## Size
| packages | size | gziped |
| -- | -- | -- |
| `k-ramel` | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg?compression=gzip)]() |
| `@k-ramel/react` | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg?compression=gzip)]() |
| `@k-ramel/driver-http` | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg?compression=gzip)]() |
| `@k-ramel/driver-redux-form` | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg?compression=gzip)]() |
| `@k-ramel/driver-redux-little-router` | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg?compression=gzip)]() |

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
 - `yarn add k-ramel`
 - `npm install --save k-ramel`

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
| listeners | `array` | `undefined` | array of all listeners. Listeners are a big part of this lib, you can [click here for detail](#TODO). |
| devtools | `boolean` | `true` | [redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension) is activated. |
| hideRedux | `boolean` | `true` | actions and selectors from [`k-redux-factory`](https://github.com/alakarteio/k-redux-factory) are used without specifying `dispatch` or `getState`. |
| enhancer | redux enhancer | `undefined` | usual `compose` and `applyMiddlare` you already use with Redux can be injected here (like router, redux-saga, etc). <br />`compose` and `applyMiddleware` from Redux are exposed by the lib. To use them:<br /> ```import { compose, applyMiddleware } from 'k-ramel'```. |
| init | `object` | `undefined` | the default value of your store. |

#### listeners
TODO

## Examples
### Create a simple store
```js
import { createStore, types } from 'k-ramel'

// create a store of todos
const store = createStore({
  todos: types.keyValue(),
})

// dispatch an action and update the store in one line, without k-ramel inner reducer
store.todos.add({ id: 2, label: 'write a better README' })

// you can retrieve data like that
const todo = store.todos.get(2)
```

### Connect it with ReactJS
1. Provide this store to React context

**app.jsx**
```js
import { provider } from '@k-ramel/react'
import store from './store'
import TodosContainer from './todos.container'

const App = () => <TodosContainer />

// use `provider` HoC to inject store to the React context
export default provider(store)(App)
```

2. Use `inject` to interact with the store, wrap your `<Todos />` graphical component in a container

**todos.container.js**
```js
import { inject } from '@k-ramel/react'
import Todos from './todos'

// `inject` is an HoC, like `connect` from react-redux,
// it takes one parameter and returns props to be injected to the wrapped component
// (FYI: props injected to the wrapped component are added to the props given by the parent)
export default inject(store => ({
  todos: store.todos.getAsArray(),
  onAdd: event => store.todos.add({ id: Date.now(), label: event.target.value }),
}))(Todos)
```

4. Write your classical React JSX component (here, as pure function)

**todos.jsx**
```js
import React from 'react'
import PropTypes from 'prop-types'

const Todos = ({ todos, onAdd }) => (
  <div>
    <input onBlur={onAdd} />
    <ul>
      {todos.map(todo => <li>{todo.label}</li>})}
    </ul>
  </div>
)

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default Todos
```

# About ![alakarteio](http://alakarte.io/assets/img/logo.markdown.png)
**alakarteio** is created by two passionate french developers.

Do you want to contact them ? Go to their [website](http://alakarte.io)

<table border="0">
 <tr>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/26094222?s=460&v=4" width="100" /></td>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/17828231?s=460&v=4" width="100" /></td>
 </tr>
 <tr>
  <td align="center"><a href="https://github.com/guillaumecrespel">Guillaume CRESPEL</a></td>
  <td align="center"><a href="https://github.com/fabienjuif">Fabien JUIF</a></td>
</table>
