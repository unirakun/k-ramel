import { types } from 'k-ramel'
import actions from './actions'
import selectors from './selectors'

export default ({
  path = 'form',
  getState = store => store.form,
  key = '@@form-name',
}) => ({
  getReducer: () => ({
    path,
    reducer: {
      values: types.keyValue({ key }),
      errors: types.keyValue({ key }),
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
