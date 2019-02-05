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

## API
### Local to a form
These functions are availables on form that is returned by this call: `drivers.form(formName)` where `formName` is your form name.

| function | description |
| --- | --- |
| `set(<object>)` | set values to the `formName` form, and remove the old ones |
| `update(fieldName)(value)` | update the value of the given fieldName to the `formName` form |
| `addOrUpdate(<object>)` | add or update given values to the `formName` form |
| `setErrors(<object>)` | set errors to the `formName` form, and remove the old ones |
| `addOrUpdateErrors(<object>)` | add or update errors to the `formName` form |
| `resetErrors()` | remove all errors to the `formName` form |
| `reset()` | remove all errors and values to the `formName` form |
| --- | --- |
| `exists()` | test that the `formName` form exists |
| `get()` | retrieve the key/value object from the `formName` form, all fields are retrieved |
| `get(<string>)` | retrieve the value of the given field name from the `formName` form |
| `getErrors()` | retrieve the key/value error object from the `formName` form |
| `getErrors(<string>)` | retrieve error of the given field name from the `formName` form |

### Batched to all given forms at once

These functions are used right into the `drivers.form` field without giving a name to it.

| function | description |
| --- | --- |
| `set([{ name: <string>, values: <object> }, ...])` | set `values` to the form identified by `name`, older values are removed |
| `addOrUpdate([{ name: <string>, values: <object> }, ...])` | add or update `values` to the form identified by `name` |
| `resetErrors([<string>, ...])` | reset errors for all the given form names |
| `reset([<string>, ...])` | reset errors and values for all the given form names |
| --- | --- |
| `find(<regexp>)` | find all form names that matches the given `regexp` |


## Helpers
  - `drivers.form.getUpdatedValues(action)` will return an _object_ of all updated pair (field name -> field value) for the given action.
  - `drivers.form.getUpdatedEntries(action)` will return an _array_ of all updated pair (field name -> field value) for the given action.
  - `drivers.form.getUpdatedFieldNames(action)` will return an _array_ of all updated field names for the given action.
