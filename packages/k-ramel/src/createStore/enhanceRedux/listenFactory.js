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


    enhancer: (createStore) => {
      const listenEnhancer = (reducer, preloadedState, enhancer) => {
        if (enhancer) return enhancer(listenEnhancer)(reducer, preloadedState)

        const innerReducer = (state, action) => {
          // trigger listeners in other javascript tick
          // (so I am not dispatching inside a reducer, which is not accepter by redux)
          setTimeout(() => {
            innerListeners
              .forEach((listeners) => {
                listeners.forEach((listener) => { listener(action, innerStore, innerDrivers) })
              })
          }, 0)

          // dispatch action
          return reducer(state, action)
        }
        return createStore(innerReducer, preloadedState)
      }

      return listenEnhancer
    },
  }
}
