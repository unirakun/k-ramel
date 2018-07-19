import { keyValue } from 'k-ramel'
import actions from './actions'
import selectors from './selectors'

export default ({
  path = 'form',
  getState = store => store.form,
  key = '@@form-name',
} = {}) => ({
  getReducer: () => ({
    path,
    reducer: {
      values: keyValue({ key }),
      errors: keyValue({ key }),
    },
  }),
  getDriver: store => (name) => {
    const state = getState(store)
    return ({
      ...actions(key)(state)(name),
      ...selectors(key)(state)(name),
    })
  },
})
