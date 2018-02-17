/* eslint-env jest */
import { compose, applyMiddleware } from 'redux'
import { routerForBrowser, push } from 'redux-little-router'
import { createStore as krmlCreateStore, when } from 'k-ramel'

export default (driver) => {
  const createStore = (description, options, routes) => {
    const { reducer, middleware, enhancer } = routerForBrowser({ routes })
    return krmlCreateStore({
      router: reducer,
      ...description,
    }, {
      ...options,
      enhancer: compose(enhancer, applyMiddleware(middleware)),
      drivers: {
        ...options.drivers,
        router: driver(state => state.router),
      },
    })
  }

  describe('drivers', () => {
    describe('redux-little-router', () => {
      describe('dispatch actions', () => {
        const routerDispatchTest = (routerAction, ...args) => {
          // spy
          const spy = jest.fn()

          // store
          const store = createStore(
            {},
            {
              listeners: [
                when('DISPATCHED')((action, st, { router }) => {
                  router[routerAction](...args)
                }),
                when(() => true)(action => spy(action)),
              ],
            },
            /* routes */
            { '/': { '/foo': { title: 'FOO_ROUTE' } } },
          )

          // dispatch action
          store.dispatch('DISPATCHED')

          // assert
          expect(spy.mock.calls[0][0].type).toMatchSnapshot()
        }

        it('should dispatch push', () => routerDispatchTest('push', '/foo'))
        it('should dispatch replace', () => routerDispatchTest('replace', '/foo'))
        it('should dispatch go', () => routerDispatchTest('go', 2))
        it('should dispatch goBack', () => routerDispatchTest('goBack'))
        it('should dispatch goForward', () => routerDispatchTest('goForward'))
        it('should dispatch block', () => routerDispatchTest('block', () => {}))
        it('should dispatch unblock', () => routerDispatchTest('unblock'))
      })

      describe('dispatch selectors', () => {
        it('should get router state', () => {
          // spy
          const spy = jest.fn()

          // store
          const store = createStore(
            {},
            {
              listeners: [
                when('ROUTER_LOCATION_CHANGED')((action, st, { router }) => {
                  console.log(st.getState().router)
                  console.log(router.getState())
                  spy(router.getState())
                }),
              ],
            },
            /* routes */
            { '/': { '/foo': { title: 'FOO_ROUTE' } } },
          )

          // dispatch action
          store.dispatch(push('/foo'))

          // assert
          expect(spy.mock.calls[0][0]).toMatchSnapshot()
        })
      })
    })
  })
}
