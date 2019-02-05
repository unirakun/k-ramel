/* eslint-env jest */
import { createStore as krmlCreateStore, when } from 'k-ramel'

export default (driver) => {
  const createStore = (description, options) => krmlCreateStore(
    description,
    {
      ...options,
      drivers: {
        ...options.drivers,
        http: driver(),
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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

      it('should set customs options', async () => {
        // mock
        const mockedFetch = jest.fn(() => Promise.resolve({}));
        (global || window).fetch = mockedFetch

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simple.object' },
        }, {
          listeners: [
            when('SET_OPTIONS')(async (action, st, { http }) => {
              // overalls options
              http.setOptions({
                headers: {
                  Authorization: 'nope auth',
                  other: 'header',
                },
                credentials: 'nope credentials',
                other: 'option',
              })

              // override authorization header from previous options
              http.setAuthorization('Bearer <my-token>')

              // override credentials from previous options
              http.setCredentials('include')
            }),
            when('DISPATCHED')(async (action, st, { http }) => {
              // not custom per request options (should use globals)
              await http('GOOGLE')('http://google.fr')

              // custom per request options
              await http('GOOGLE_OVERRIDE')('http://google_2.fr', {
                headers: {
                  yep: 'new one header',
                  Authorization: 'new auth',
                },
                credentials: 'new credentials',
                yep: 'new one option',
              })
              resolver()
            }),
          ],
        })

        store.dispatch('SET_OPTIONS')
        store.dispatch('DISPATCHED')
        await wait

        // assert
        expect({
          fetchCounts: mockedFetch.mock.calls.length,
          globalOptions: mockedFetch.mock.calls[0],
          overridedOptions: mockedFetch.mock.calls[1],
        }).toMatchSnapshot()
      })

      it('should set and clear Authorization', async () => {
        // mock
        const mockedFetch = jest.fn(() => Promise.resolve({}));
        (global || window).fetch = mockedFetch

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore({
          config: { type: 'simple.object' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              // not custom per request options (should use globals)
              await http('GOOGLE')('http://google_0.fr')

              http.setOptions({
                headers: {
                  Authorization: 'auth',
                },
              })
              await http('GOOGLE')('http://google_1.fr')

              http.clearAuthorization()
              await http('GOOGLE')('http://google_2.fr')

              http.setAuthorization('auth')
              await http('GOOGLE')('http://google_3.fr')

              http.setAuthorization()
              await http('GOOGLE')('http://google_4.fr')
              resolver()
            }),
          ],
        })

        store.dispatch('SET_OPTIONS')
        store.dispatch('DISPATCHED')
        await wait

        // assert
        expect({
          fetchCounts: mockedFetch.mock.calls.length,
          noOption: mockedFetch.mock.calls[0],
          overridedAuth: mockedFetch.mock.calls[1],
          clearedAuth: mockedFetch.mock.calls[2],
          setAuthorization: mockedFetch.mock.calls[3],
          setAuthorizationToUndefined: mockedFetch.mock.calls[4],
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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
          config: { type: 'simple.object' },
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

      it('should not stringify data when data is formData', async () => {
        // mock
        const mockedFetch = jest.fn((url, options) => Promise.resolve({ url, options }));
        (global || window).fetch = mockedFetch

        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // payload
        const body = new FormData()
        body.append('some', 'data')

        // store
        const store = createStore({
          config: { type: 'simple.object' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE').post('http://google.fr', body)
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
          // since jest 24 body formdata (which is a symbol) is not serialized
          fetchBodyForm: new Map(mockedFetch.mock.calls[0][1].body.entries()),
        }).toMatchSnapshot()
      })

      it('should add context on http response', async () => {
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
          config: { type: 'simple.object' },
        }, {
          listeners: [
            when('DISPATCHED')(async (action, st, { http }) => {
              await http('GOOGLE', { context: 1, other: 'context' }).get('http://google.fr')
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

    it('should add headers on http response', async () => {
      // mock
      const mockedFetch = jest.fn((url, options) => Promise.resolve({
        url,
        options,
        headers: new Map([['Content-Type', 'application/json'], ['Content-Length', '10']]),
        json: () => Promise.resolve({ actual: 'data' }),
      }));
      (global || window).fetch = mockedFetch

      // dispatch spy
      const spy = jest.fn()

      // wait
      let resolver
      const wait = new Promise((resolve) => { resolver = resolve })

      // store
      const store = createStore({
        config: { type: 'simple.object' },
      }, {
        listeners: [
          when('DISPATCHED')(async (action, st, { http }) => {
            await http('GOOGLE', { context: 1, other: 'context' }).get('http://google.fr')
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
}
