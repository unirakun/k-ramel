import { types } from 'k-ramel'
import actions from './actions'
import selectors from './selectors'
import utils from './utils'

export default ({
  path = 'form',
  getState = store => store.form,
  key = '@@form-name',
} = {}) => ({
  getReducer: () => ({
    path,
    reducer: {
      values: types.keyValue({ key }),
      errors: types.keyValue({ key }),
    },
  }),
  getDriver: (store) => {
    const state = getState(store)
    return Object.assign(
      name => ({
        ...actions(key)(state)(name),
        ...selectors(key)(state)(name),
      }),
      utils(state),
    )
  },
})
