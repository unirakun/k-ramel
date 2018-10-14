# k-ramel

State manager for your app components, the safe and easy way.

[![CircleCI](https://circleci.com/gh/alakarteio/k-ramel.svg?style=shield)](https://circleci.com/gh/alakarteio/k-ramel) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-ramel/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-ramel?branch=master) [![NPM Version](https://badge.fury.io/js/k-ramel.svg)](https://www.npmjs.com/package/k-ramel) [![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/k-ramel.svg)](https://greenkeeper.io/)

<p align="center">
  <img src="packages/k-ramel/doc/logo.png" width="400" />
</p>

## Why should you give it a try ? 🤔
Because `k-ramel`:
 - ⚡️ is fast
 - 📸 is immutable
 - 📦 is [modular](#modules)
 - 💎 encourages to decouple UI and state management
 - 💥 encourages to not have side effect into your business logic
 - 👌 has a [light bundle size](https://bundlephobia.com/result?p=k-ramel@next) footprint (with http driver)
 - 🐛 works with redux-dev-tools

## Modules
| packages | description | size | gziped |
| -- | -- | -- | -- |
| [`k-ramel`](./packages/k-ramel/README.md) | core package | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/k-ramel/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/react`](./packages/connectors/react/README.md) | ReactJS connector ([documentation](./packages/connectors/react/README.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/connectors/react/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-http`](./packages/drivers/http/README.md) | fetch wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/http/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-form`](./packages/drivers/form/README.md) | minimalist form handler ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/form/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/form/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-redux-form`](./packages/drivers/redux-form/README.md) | redux-form  wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md)) | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-form/dist/index.es.js.svg?compression=gzip)]() |
| [`@k-ramel/driver-redux-little-router`](./packages/drivers/redux-little-router/README.MD) | redux-littler-router wrapper ([drivers documentation](./packages/k-ramel/doc/DRIVERS.md))  | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg)]() | [![Size](http://img.badgesize.io/alakarteio/k-ramel/master/packages/drivers/redux-little-router/dist/index.es.js.svg?compression=gzip)]() |

## Ecosystem
You can pick some modules based on your usage, or even write your own.
\
The modules that are supported by k-ramel are [listed here](#modules).
\
We add modules when we need them but feel free to open PR if you want to add your own.

Modules can be :
 - **connectors**, used to connect your buisiness logic (and your data) to your UI. We only have a ReactJS connector at the moment.
 - **drivers**, used to do some side effects (http, window, history, etc) or share some logic, besides your buisiness logic.

## How to use k-ramel
<p align="center">
  <img src="packages/k-ramel/doc/graph.png" width="800" />
</p>

`k-ramel` is a data store that allows you to `listen` to `event` and then `react` to it.
In a `reaction` you can access:
 - the outside world via `drivers`, this is where you put your side effects, like HTTP calls
 - your data, via `store`

Then if you connect an UI to k-ramel, via connectors, it can be refreshed each time the `store` is updated.

You can find documentation about each part of `k-ramel` there:
 - [listeners](./packages/k-ramel/doc/LISTENERS.md)
 - [reactions](./packages/k-ramel/doc/REACTIONS.md)
 - [drivers](./packages/k-ramel/doc/DRIVERS.md)

## Examples
 - Our own [todo-mvc](./examples/todomvc)
 - [conference-hall](https://github.com/bpetetot/conference-hall) from **[@bpetetot](https://github.com/bpetetot)**
 - [k-mille](https://github.com/alakarteio/k-mille/), our personal assistant **[@alakarteio](https://github.com/alakarteio)**

# Contributors
 - Fabien JUIF [[@fabienjuif](https://github.com/fabienjuif)]
 - Guillaume CRESPEL [[@guillaumecrespel](https://github.com/guillaumecrespel)]
 - Benjamin PETETOT [[@bpetetot](https://github.com/bpetetot)]
 - Valentin COCAUD [[@EmrysMyrddin](https://github.com/EmrysMyrddin)]
 - Yvonnick FRIN [[@frinyvonnick](https://github.com/frinyvonnick)]
 - Delphine MILLET [[@delphinemillet](https://github.com/delphinemillet)]
 - Benjamin PLOUZENNEC [[@Okazari](https://github.com/Okazari)]

# Known users
 - [sparklane](https://www.sparklane-group.com) - B2B Predictive lead scoring _[closed source]_
 - [metroscope](http://metroscope.tech/) - AI diagnosis for targeted maintenance _[closed source]_
 - [conference-hall](https://github.com/bpetetot/conference-hall) - A call for paper project _[open source]_
 - [k-mille](https://github.com/alakarteio/k-mille/) - alakarteio assistant _[open source]_

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
