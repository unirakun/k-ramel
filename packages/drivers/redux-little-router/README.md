# @k-ramel/driver-redux-little-router
> redux-little-router driver for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Examples
In a reaction (See main documentation about listeners/reactions)

**Declare it in your store :**
```js
import driver from '@k-ramel/driver-redux-little-router'

const router = driver({ routes }, state => state.router, 'router')

createStore(
  {
    // your usual definition
  },
  {
    drivers: { router },
  },
)
```

**In your reaction :**
```js
export const onUserLoggedIn = (store, action, drivers) => {
  const { router } = drivers
  // get userId in route params
  const userId = router.getRouteParam('userId')
  // dispatch push action to go to the new route
  router.push(`/user/${userId}`)
}
```
