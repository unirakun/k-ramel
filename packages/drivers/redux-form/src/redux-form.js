import { reducer } from 'redux-form'
import actions from './actions'
import customActions from './actions.custom'
import selectors from './selectors'

export default ({ path = 'form', getState = state => state.form } = {}) => ({
  getDriver: store => name => ({
    // actions
    ...actions(store)(name),
    // selectors
    ...selectors(getState)(store)(name),
    // custom actions
    ...customActions(store)(name),
  }),
  getReducer: () => ({
    path,
    reducer,
  }),
})
