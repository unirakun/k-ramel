# @k-ramel/driver-redux-form
> Redux Form driver for k-ramel makes accessible all actions and selectors of Redux Form  
 
 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)
 - Redux Form API for [actions](https://redux-form.com/7.3.0/docs/api/actioncreators.md/#action-creators) and [selectors](https://redux-form.com/7.3.0/docs/api/selectors.md/#selectors)

## Examples
In store description (See main documentation about description)
```js
/* description.js */
import { reducer as form } from 'redux-form'

export default () => ({
  form,
})
```

In store definition (See main documentation about description)
```js
/* store.js */
import { createStore } from 'k-ramel'
import description from './description'
import listeners from './listeners'
import reduxform from '@k-ramel/driver-redux-form'

export default () => {
  const store = createStore(
    description,
    {
      listeners,
      drivers: {
        // by default getFormState = state => state.form
        form: reduxform(/* optional : getFormState */)
      },
    },
  )

  return store
}
```

In a reaction (See main documentation about listeners/reactions)
```js
/* reaction.js */
import { reaction } from 'k-ramel'

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
