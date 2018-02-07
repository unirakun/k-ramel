export default (listeners, drivers) => {
  // k-simple-state store
  let innerStore

  // k-simple-state drivers (enhanced with store)
  let innerDrivers

  return {
    // this setter is needed since the middleware is pass to redux
    // createStore, and then BEFORE, we have store instanciated
    setStore: (store) => {
      innerStore = store
      innerDrivers = Object
        .keys(drivers)
        .reduce(
          (acc, driver) => ({ ...acc, [driver]: drivers[driver](store) }),
          {},
        )
    },

    // redux middleware
    middleware: () => next => (action) => {
      // dispatch action
      const res = next(action)

      // trigger listeners
      listeners.forEach((listener) => { listener(action, innerStore, innerDrivers) })

      // return action result
      return res
    },
  }
}
