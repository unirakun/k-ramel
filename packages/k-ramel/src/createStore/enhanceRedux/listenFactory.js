export default (rootListeners = [], drivers) => {
  // k-ramel store
  let innerStore

  // k-ramel drivers (enhanced with store)
  let innerDrivers

  // k-ramel listners
  let innerListeners = [rootListeners]

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

    // this is to add new listeners
    addListeners: (listeners) => {
      innerListeners = [...innerListeners, listeners]
    },

    // this is to remove listeners
    removeListeners: (listeners) => {
      innerListeners = innerListeners.filter(l => l !== listeners)
    },

    // redux middleware
    middleware: () => next => (action) => {
      // dispatch action
      const res = next(action)

      // trigger listeners
      innerListeners
        .forEach((listeners) => {
          try {
            listeners.forEach((listener) => { listener(action, innerStore, innerDrivers) })
          } catch (exception) {
            innerStore.dispatch({ type: '@@krml/EXCEPTION', payload: { from: action, exception } })
          }
        })

      // return action result
      return res
    },
  }
}
