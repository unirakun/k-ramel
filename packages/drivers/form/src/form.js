import { types } from 'k-ramel'
import actions from './actions'
import bulkActions from './bulk.actions'
import selectors from './selectors'
import utils from './utils'

export default ({
  path = 'form',
  getState = store => store.form,
  key = '@@form',
} = {}) => {
  const keyName = `${key}-name`

  return {
    getReducer: () => ({
      path,
      reducer: {
        values: types.keyValue({ key: keyName }),
        errors: types.keyValue({ key: keyName }),
      },
    }),
    getDriver: (store) => {
      const state = getState(store)

      return Object.assign(
        name => ({
          ...actions(key)(state)(name),
          ...selectors(keyName)(state)(name),
        }),
        bulkActions(key)(state),
        utils(state),
      )
    },
  }
}
