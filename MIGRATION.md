# Migration Guide
## From 1.x.x to 2.0.0
### Deprecated
 - `@k-ramel/driver-redux-little-router` driver is deprecated. [You can now use `k-redux-router`](https://github.com/alakarteio/k-redux-router):
    * We are removing it because `redux-little-router` is deprecated and archived from its authors: https://github.com/FormidableLabs/redux-little-router

### Breaking changes
 - `@k-ramel/driver-http` is not imported by default
    * In order to keep `k-ramel` as light as possible we remove the default usage of this driver
    * When we added it as a default driver, we though that almost everybody would use it but since `graphql` is becoming strong, we believe it's time to not make it a default one
    * `k-ramel` will be even lighter by default!

### May be breaking changes
 - `devtools` options (from `createStore`) is now `undefined` by default
    * If you set it `false` or `true` then we will follow what you want regardless of `NODE_ENV`
    * If the value is `undefined` then we will activate dev tools extension if `NODE_ENV` is not equal to `production`
    * If you set `devtool: undefined` in version 1.x.x of `k-ramel`, you have to set it to `false` to have the same behaviour in version 2.0.0.
 - A new helper is added to k-ramel: `reset()`
    * This is added everywhere in the store tree (eg: store.reset(), store.data.reset(), etc)
    * If your definition tree (given to `createStore` first parameter) contains `reset` it will break
    * If you are in this case, please fill an issue :)
 - `reset` new helper comes with `RESET` constant
    * See previous description!
