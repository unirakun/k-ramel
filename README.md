# k-ramel

State manager for your components apps, the safe and easy way.

[![CircleCI](https://circleci.com/gh/alakarteio/k-ramel.svg?style=shield)](https://circleci.com/gh/alakarteio/k-ramel) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-ramel/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-ramel?branch=master) [![NPM Version](https://badge.fury.io/js/k-ramel.svg)](https://www.npmjs.com/package/k-ramel) [![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/k-ramel.svg)](https://greenkeeper.io/)

<p align="center">
  <img src="packages/k-ramel/doc/logo.png" width="400" />
</p>

## Modules
| packages | description | size | gziped |
| -- | -- | -- | -- |
| [`k-ramel`](./packages/k-ramel/README.md) | core package | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/react`](./packages/connectors/react/README.md) | ReactJS connector | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-http`](./packages/drivers/http/README.md) | fetch wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-form`](./packages/drivers/form/README.md) | minimalist form handler ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/form/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/form/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-redux-form`](./packages/drivers/redux-form/README.md) | redux-form  wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-redux-little-router`](./packages/drivers/redux-little-router/README.MD) | redux-littler-router wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md))  | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg?compression=gzip)]() |

## Contents
 - [Why do we like our lib ?](#why-do-we-like-our-lib)
 - [Ecosystem](#ecosystem)
 - [Examples](#examples)

## Why do we like our lib
 - ⚡️ fast
 - 📸 immutable
 - 📦 modular
 - 💎 UI and state management are decoupled, thank to the event bus
 - 💥 no side effect into your buisiness logic
 - 👌 light bundle size (see https://bundlephobia.com/result?p=k-ramel@0.13.2)
 - 🐛 works with redux-dev-tools

## Ecosystem
You can pick some module based on your usage, or even write your own.
\
The modules that are supported by k-ramel are listed at the [beginin of the README](#modules).
\
We add modules when we need them but feel free to open PR if you want to add your own.

Modules can be :
 - **connectors**, used to connect your buisiness logic (and your data) to your UI. We only have a ReactJS connector at the moment.
 - **drivers**, used for doing side effects (http, window, history, etc) or share some logic.

## Examples
 - Our own [todo-mvc](./examples/todomvc)
 - [conference-hall](https://github.com/bpetetot/conference-hall) from @bpetetot
 - [k-mille](https://github.com/alakarteio/k-mille/), our personal assistant @alakarteio

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
