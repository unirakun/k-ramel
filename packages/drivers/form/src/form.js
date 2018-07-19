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
      values: types.keyValue({ key: 'name' }),
      errors: types.keyValue({ key: 'name' }),
    },
  }),
  getDriver: store => (form) => {
    const state = getState(store)
    return ({
      ...actions(state)(form),
      ...selectors(state)(form),
    })
  },
})
