import { types } from 'k-ramel'
import actions from './actions'
import selectors from './selectors'

export default ({
  path = 'form',
  getState = store => store.form,
}) => ({
  getReducer: () => ({
    path,
    reducer: {
      values: types.keyValue(),
      errors: types.keyValue(),
    },
  }),
  getDriver: store => (form) => {
    const state = getState(store)
    const { set, reset, onChange, destroy } = actions(state)(form)
    const { exists, get } = selectors(state)(form)
    return ({
      /* meta */
      exists,
      init: set('values'),
      destroy,
      /* values */
      get: get('values'),
      set: set('values'),
      onChange,
      /* errors */
      setErrors: set('errors'),
      getErrors: get('errors'),
      clearErrors: reset('errors'),
    })
  },
})
