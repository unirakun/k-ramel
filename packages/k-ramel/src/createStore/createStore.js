import { createStore, compose } from 'redux'
import reduxFactory from './reduxFactory'
import toContext from './toContext'
import combine from './combine'
import enhanceRedux from './enhanceRedux'
import addReset from './addReset'

const defaultOptions = {
  hideRedux: true,
  enhancer: undefined,
  init: {},
  listeners: undefined,
  devtools: undefined, // meaning activated if not in production
  trace: false,
  traceLimit: 25,
  name: 'store',
  drivers: {},
}

export default (definition, options = defaultOptions) => {
  // options
  const innerOptions = {
    ...defaultOptions,
    ...options,
    drivers: {
      ...defaultOptions.drivers,
      ...options.drivers,
    },
  }
  const { init, hideRedux, drivers } = innerOptions
  const definitionWithDrivers = { ...definition }

  // use drivers
  const driversEnhancers = []
  const driversInits = []
  Object.values(drivers)
    .forEach((driver) => {
      // bind reducer to store definition
      if (driver.getReducer) {
        const { reducer, path } = driver.getReducer() // eslint-disable-line no-unused-vars
        if (path.length) {
          const [firstKey, ...others] = path.split('.')
          definitionWithDrivers[firstKey] = others.reverse().reduce((acc, key) => ({ [key]: acc }), reducer)
        }
      }

      // add enhancer
      if (driver.getEnhancer) driversEnhancers.push(driver.getEnhancer())

      // add init
      if (driver.init) driversInits.push(driver.init)
    })

  // add all driver enhancers
  if (innerOptions.enhancer) driversEnhancers.push(innerOptions.enhancer)
  innerOptions.enhancer = compose(...driversEnhancers)

  // this is reducer exports (action/selectors)
  let reducerTree = reduxFactory(definitionWithDrivers)

  // instanciate the listen middleware and prepare redux enhancers
  const { enhancer, listen } = enhanceRedux(innerOptions)

  // this is the redux store
  const reduxStore = createStore(
    combine(reducerTree),
    init,
    enhancer,
  )

  // add resets actions
  reducerTree = addReset(innerOptions)(reducerTree, reduxStore)

  // convert to a contextualized version
  if (hideRedux) {
    reducerTree = toContext(reducerTree, reduxStore)
  }

  // store (our own)
  const store = {
    ...reducerTree,
    ...reduxStore,
    listeners: {
      add: listen.addListeners,
      remove: listen.removeListeners,
    },
  }

  // store with driver
  store.drivers = Object.keys(drivers)
    .reduce(
      (acc, driver) => ({ ...acc, [driver]: drivers[driver].getDriver(store) }),
      {},
    )

  // custom dispatch
  const reduxDispatch = store.dispatch
  store.dispatch = (action, ...args) => {
    if (typeof action === 'string') return reduxDispatch({ type: action })
    return reduxDispatch(action, ...args)
  }

  // pass store to listen (after it has been created)
  listen.setStore(store)

  // dispatch init event
  store.dispatch('@@krml/INIT')

  // init drivers
  driversInits.forEach(driverInit => driverInit(store))

  return store
}
