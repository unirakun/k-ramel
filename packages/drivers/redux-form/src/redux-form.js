import actions from './actions'
import customActions from './actions.custom'
import selectors from './selectors'

export default getFormState => store => name => ({
  // actions
  ...actions(store)(name),
  // selectors
  ...selectors(getFormState)(store)(name),
  // custom actions
  ...customActions(store)(name),
})
