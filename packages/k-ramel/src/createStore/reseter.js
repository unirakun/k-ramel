export default (reducer, path) => (state, action = {}) => {
  switch (action.type) {
    case '@@krml/RESET': {
      if (path.startsWith(action.payload || '')) return reducer(undefined, {})
      return state
    }
    default: return reducer(state, action)
  }
}
