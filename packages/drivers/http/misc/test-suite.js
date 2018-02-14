/* eslint-env jest */
import { createStore as krmlCreateStore, when } from 'k-ramel'

export default (driver) => {
  const createStore = (description, options) => krmlCreateStore(
    description,
    {
      ...options,
      drivers: {
        ...options.drivers,
        http: driver,
      },
    },
  )

  describe('drivers', () => {
    describe('http', () => {
      const { fetch } = (global || window)
      afterEach(() => {
        if (global) global.fetch = fetch
        if (window) window.fetch = fetch
      })

      it('should stringify data but not override content-type', async () => {
        // mock
        const mockedFetch = jest.fn((url, options) => Promise.resolve({ url, options }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE').post('http://google.fr', { some: 'data' }, { headers: { 'Content-Type': 'my-contentType' } })
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should stringify data with method helper', async () => {
        // mock
        const mockedFetch = jest.fn((url, options) => Promise.resolve({ url, options }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE').post('http://google.fr', { some: 'data' })
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should works with method helper (OPTIONS)', async () => {
        // mock
        const mockedFetch = jest.fn((url, options) => Promise.resolve({ url, options }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE').options('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should set authorization header', async () => {
        // mock
        const mockedFetch = jest.fn(() => Promise.resolve({}));
        (global || window).fetch = mockedFetch

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('SET_HEADER')(async (action, st, { http }) => {
              http.setAuthorization('Bearer <my-token>')
              resolver()
            }),
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
          ],
        })

        store.dispatch({ type: 'SET_HEADER' })
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should safely fail to parse json', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          headers: { get: () => 'application/json' },
          json: () => { throw new Error(`oups-json-${url}`) },
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })


      it('should safely fail to request', async () => {
        // mock
        const mockedFetch = jest.fn((url) => { throw new Error(`oups-${url}`) });
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data and dispatch a FAILED', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          status: 404,
          url,
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data and calls json()', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          headers: { get: () => 'application/json' },
          json: () => Promise.resolve({ result: url }),
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })

      it('should fetch data an trigger common events', async () => {
        // mock
        const mockedFetch = jest.fn(url => Promise.resolve({
          json: () => Promise.resolve({ result: url }),
        }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simpleObject' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE')('http://google.fr')
              resolver()
            }),
            when(() => true)(action => spy(action)),
          ],
        })

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
          fetch: mockedFetch.mock.calls,
        }).toMatchSnapshot()
      })
    })
  })
}
