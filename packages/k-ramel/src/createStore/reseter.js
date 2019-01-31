import { TYPE } from './addReset'

export default (reducer, path) => (state, action = {}) => {
  switch (action.type) {
    case TYPE: {
      if (path.startsWith(action.payload || '')) return reducer(undefined, {})
      return state
    }
    default: return reducer(state, action)
  }
}
