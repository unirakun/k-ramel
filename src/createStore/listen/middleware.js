export default (listeners) => {
  // k-simple-state store
  let innerStore

  return {
    // this setter is needded since the middleware is pass to redux
    // createStore, and then BEFORE, we have store instanciated
    setStore: (store) => { innerStore = store },

    // redux middleware
    middleware: () => next => (action) => {
      // dispatch action
      const res = next(action)

      // trigger listeners
      listeners.forEach((listener) => { listener(action, innerStore) })

      // return action result
      return res
    },
  }
}
