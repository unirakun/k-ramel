# k-ramel

State manager for your app components, the safe and easy way.

> **Core** module of `k-ramel` ecosystem (👉 [main documentation](https://github.com/alakarteio/k-ramel))

[![CircleCI](https://circleci.com/gh/alakarteio/k-ramel.svg?style=shield)](https://circleci.com/gh/alakarteio/k-ramel) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-ramel/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-ramel?branch=master) [![NPM Version](https://badge.fury.io/js/k-ramel.svg)](https://www.npmjs.com/package/k-ramel)

<p align="center">
  <img src="./doc/logo.png" width="400" />
</p>

## Why should you give it a try ? 🤔
Because `k-ramel`:
 - ⚡️ is fast
 - 📸 is immutable
 - 📦 is modular
 - 💎 encourages to decouple UI and state management
 - 💥 encourages to not have side effect into your business logic
 - 👌 has a [light bundle size](https://bundlephobia.com/result?p=k-ramel@next) footprint
 - 🐛 works with redux-dev-tools

## [Ecosystem](https://github.com/alakarteio/k-ramel#ecosystem)
[Go to the ecosystem documentation](https://github.com/alakarteio/k-ramel#ecosystem)

## How to use k-ramel
<p align="center">
  <img src="./doc/graph.png" width="800" />
</p>

`k-ramel` is a data store that allows you to `listen` to `event` and then `react` to it.
In a `reaction` you can access:
 - the outside world via `drivers`, this is where you put your side effects, like HTTP calls
 - your data, via `store`

Then if you connect an UI to k-ramel, via connectors, it can be refreshed each time the `store` is updated.

You can find documentation about each part of `k-ramel` there:
 - [store](https://github.com/alakarteio/k-ramel/blob/master/packages/k-ramel/doc/STORE.md)
 - [listeners](https://github.com/alakarteio/k-ramel/blob/master/packages/k-ramel/doc/LISTENERS.md)
 - [reactions](https://github.com/alakarteio/k-ramel/blob/master/packages/k-ramel/doc/REACTIONS.md)
 - [drivers](https://github.com/alakarteio/k-ramel/blob/master/packages/k-ramel/doc/DRIVERS.md)
