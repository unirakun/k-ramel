# @k-ramel/driver-form
> Form driver for k-ramel
 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Examples
```js
/* store.js */
import { createStore } from 'k-ramel'
import form from '@k-ramel/driver-form'

export default createStore(
  {
    /* your store description */
  },
  {
    drivers: {
      form: form({ path: 'ui.form', getState: store => store.ui.form }) // default is { path: 'form', getState: store => store.form }
    },
  },
)
```

In a reaction (See main documentation about listeners/reactions)
```js
/* reaction.js */

export const login = (store, action, { form, http }) => {
  const loginValues = form('login').get()
  http('LOGIN').post('/api/login', loginValues)
}

export const setError = (action, store, { form }) => {
  form('login').setErrors({ code: 'login_error' })
}
```

In a component container (See main documentation about @k-ramel/react)
```js
/* input.container.js */

import { inject } from '@k-ramel/react'
import Component from './input'

const mapStore = inject((store, { formName, field }, drivers) => {
  const form = drivers.form(formName)
  return {
    value: form.get(field),
    error: form.getErrors(field),
    onChange: (e) => { form.onChange(field)(e.target.value) },
  }
})

export default mapStore(Component)
```

## Helpers
  - `drivers.form.getUpdatedValues(action)` will return an _object_ of all updated pair (field name -> field value) for the given action.
  - `drivers.form.getUpdatedEntries(action)` will return an _array_ of all updated pair (field name -> field value) for the given action.
  - `drivers.form.getUpdatedFieldNames(action)` will return an _array_ of all updated field names for the given action.
