# @k-ramel/driver-redux-form
> Redux Form driver for k-ramel
 - All Redux Form 's [actions](https://redux-form.com/7.3.0/docs/api/actioncreators.md/#action-creators) and [selectors](https://redux-form.com/7.3.0/docs/api/selectors.md/#selectors) are available and wrapped.
 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Install it
`yarn add @k-ramel/driver-redux-form regeneratorRuntime`

## Note
You have to wrap your application with `react-redux` Provider and giving the k-ramel store created via `createStore` in order to work.

## Examples
In store definition (See main documentation about description)
```js
/* store.js */
import { createStore } from 'k-ramel'
import reduxform from '@k-ramel/driver-redux-form'

export default createStore(
  {
    /* your store description */
  },
  {
    drivers: {
      form: reduxform({ path: 'ui.form', getState: state => state.ui.form }) // default is { path: 'form' }
    },
  },
)
```

In a reaction (See main documentation about listeners/reactions)
```js
/* reaction.js */

export const signin = (store, action, drivers) => {
  const { form, http } = drivers
  const signinForm = form('signin')
  const loginValues = signinForm.getFormValues()
  // check login is not empty
  if (loginValues.login && loginValues.password) {
    signinForm.setSubmitSucceeded()
  } else {
    signinForm.setSubmitFailed()
  }
}
```
