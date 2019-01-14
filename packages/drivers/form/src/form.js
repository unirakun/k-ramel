import { types } from 'k-ramel'
import actions from './actions'
import bulkActions from './bulk.actions'
import selectors from './selectors'
import utils from './utils'
import helpers from './helpers'

export default ({
  path = 'form',
  getState = store => store.form,
  key = '@@form-name',
} = {}) => {
  const keyName = key
  let baseKey = '@@form'

  // in case this is not the default key that is given, we just consider the baseKey is the key
  // in this case this is not a breaking change from 1.2.0 to 1.3.0
  if (key !== '@@form-name') baseKey = key

  const keyFields = `${baseKey}-fields`

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
          ...actions({ keyName, keyFields })(state)(name),
          ...selectors({ keyName, keyFields })(state)(name),
        }),
        bulkActions({ keyName, keyFields })(state),
        utils(state),
        helpers({ keyName, keyFields }),
      )
    },
  }
}
