# @k-ramel/form
> Form driver for k-ramel
 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Examples
```js
/* store.js */
import { createStore } from 'k-ramel'
import form from '@k-ramel/form'

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

export const signin = (store, action, drivers) => {
  const { form, http } = drivers
  const signinForm = form('signin')
  const loginValues = signinForm.get()
}
```
