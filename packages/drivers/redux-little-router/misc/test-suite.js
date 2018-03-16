/* eslint-env jest */
import { push } from 'redux-little-router'
import { createStore as krmlCreateStore, when } from 'k-ramel'
import omit from 'lodash/omit'

export default (driver) => {
  /* create k-ramel store with redux-little-router driver */
  const createStore = (description, options, routes) => {
    const router = driver(routes)
    return krmlCreateStore({
      ...description,
    }, {
      ...options,
      drivers: {
        ...options.drivers,
        router,
      },
    })
  }

  describe('drivers', () => {
    describe('redux-little-router', () => {
      describe('router implementation', () => {
        it('should overide default router implementation', () => {
          // spy
          const routerImplSpy = () => ({
            reducer: 'CUSTOM ROUTER IMPL REDUCER',
            enhancer: () => {},
            middleware: () => {},
          })

          // store
          const router = driver(routerImplSpy({ routes: { '/': { '/foo': { title: 'FOO_ROUTE' } } } }))

          // assert
          expect(router.getReducer().reducer).toBe('CUSTOM ROUTER IMPL REDUCER')
        })
      })

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
          expect(spy.mock.calls[1][0].type).toMatchSnapshot()
        }

        it('should dispatch push', () => routerDispatchTest('push', '/foo'))
        it('should dispatch replace', () => routerDispatchTest('replace', '/foo'))
        it('should dispatch go', () => routerDispatchTest('go', 2))
        it('should dispatch goBack', () => routerDispatchTest('goBack'))
        it('should dispatch goForward', () => routerDispatchTest('goForward'))
        it('should dispatch block', () => routerDispatchTest('block', () => {}))
        it('should dispatch unblock', () => routerDispatchTest('unblock'))
      })

      describe('selectors', () => {
        it('should get router state', () => {
          // spy
          const spy = jest.fn()

          // store
          const store = createStore(
            {},
            {
              listeners: [
                when('CHECK')((action, st, { router }) => {
                  spy(omit(router.get(), 'key'))
                }),
              ],
            },
            /* routes */
            { '/': { '/foo': { title: 'FOO_ROUTE' } } },
          )

          // dispatch action
          store.dispatch(push('/foo'))
          store.dispatch('CHECK')

          // assert
          expect(spy.mock.calls).toMatchSnapshot()
        })
      })

      it('should get router param', () => {
        // spy
        const spy = jest.fn()

        // store
        const store = createStore(
          {},
          {
            listeners: [
              when('CHECK')((action, st, { router }) => {
                spy(router.getRouteParam('id'))
              }),
            ],
          },
          /* routes */
          { '/': { '/foo/:id': { title: 'FOO_ROUTE' } } },
        )

        // dispatch action
        store.dispatch(push('/foo/123'))
        store.dispatch('CHECK')

        // assert
        expect(spy.mock.calls).toMatchSnapshot()
      })
    })

    it('should get query param', () => {
      // spy
      const spy = jest.fn()

      // store
      const store = createStore(
        {},
        {
          listeners: [
            when('CHECK')((action, st, { router }) => {
              spy(router.getQueryParam('bar'))
            }),
          ],
        },
        /* routes */
        { '/': { '/foo': { title: 'FOO_ROUTE' } } },
      )

      // dispatch action
      store.dispatch(push('/foo?bar=baz'))
      store.dispatch('CHECK')

      // assert
      expect(spy.mock.calls).toMatchSnapshot()
    })

    it('should get result param of the current route else undefined', () => {
      // spy
      const spy = jest.fn()

      // store
      const store = createStore(
        {},
        {
          listeners: [
            when('CHECK')((action, st, { router }) => {
              spy(router.getResultParam('title'))
              spy(router.getResultParam('dont-exists'))
            }),
          ],
        },
        /* routes */
        { '/': { title: 'ROOT', '/foo': { title: 'FOO_ROUTE' } } },
      )

      // dispatch action
      store.dispatch(push('/foo'))
      store.dispatch('CHECK')

      // assert
      expect(spy.mock.calls).toMatchSnapshot()
    })

    it('should get result param of the parent else undefined', () => {
      // spy
      const spy = jest.fn()

      // store
      const store = createStore(
        {},
        {
          listeners: [
            when('CHECK')((action, st, { router }) => {
              spy(router.getParentResultParam('title'))
              spy(router.getParentResultParam('dont-exists'))
            }),
          ],
        },
        /* routes */
        { '/': { title: 'ROOT', '/foo': { } } },
      )

      // dispatch action
      store.dispatch(push('/foo'))
      store.dispatch('CHECK')

      // assert
      expect(spy.mock.calls).toMatchSnapshot()
    })

    it('should return true is its the current route else false', () => {
      // spy
      const spy = jest.fn()

      // store
      const store = createStore(
        {},
        {
          listeners: [
            when('CHECK')((action, st, { router }) => {
              spy(router.isRoute('/foo'))
              spy(router.isRoute('/bar'))
            }),
          ],
        },
        /* routes */
        { '/': { title: 'ROOT', '/foo': { } } },
      )

      // dispatch action
      store.dispatch(push('/foo'))
      store.dispatch('CHECK')

      // assert
      expect(spy.mock.calls).toMatchSnapshot()
    })

    it('should return true is the param with the given value match in the route result, else false', () => {
      // spy
      const spy = jest.fn()

      // store
      const store = createStore(
        {},
        {
          listeners: [
            when('CHECK')((action, st, { router }) => {
              spy(router.isParentResultParam('title', 'FOO_ROUTE'))
              spy(router.isParentResultParam('title', 'ROOT'))
              spy(router.isParentResultParam('title', 'DOESNT MATCH'))
            }),
          ],
        },
        /* routes */
        { '/': { title: 'ROOT', '/foo': { title: 'FOO_ROUTE' } } },
      )

      // dispatch action
      store.dispatch(push('/foo'))
      store.dispatch('CHECK')

      // assert
      expect(spy.mock.calls).toMatchSnapshot()
    })
  })
}
