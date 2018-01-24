/* eslint-env jest */
export default (lib) => {
  const {
    createStore,
    simpleObject,
    keyValue,
    compose,
    applyMiddleware,
    take,
  } = lib

  describe('k-simple-state', () => {
    const simpleTests = (getStore) => {
      it('should initialized', () => {
        const store = getStore()
        expect(store.getState()).toMatchSnapshot()
      })

      it('should instanciate a keyValue reducer', () => {
        const store = getStore()

        // mutation
        store.data.todos.add({ id: 2, label: 'find a name' })

        // selection
        const todo = store.data.todos.get(2)

        expect({
          state: store.getStore().getState(),
          todo,
        }).toMatchSnapshot()
      })

      it('should instanciate a simpleObject reducer', () => {
        const store = getStore()

        // mutation
        store.ui.screens.newTodo.set('finish tests')

        // selection
        const label = store.ui.screens.newTodo.get()

        expect({
          state: store.getState(),
          label,
        }).toMatchSnapshot()
      })
    }

    describe('with plain object', () => {
      const getNewStore = () => createStore({
        data: {
          todos: { type: 'keyValue', key: 'id' },
        },
        ui: {
          screens: {
            newTodo: { type: 'simpleObject' },
          },
        },
      })

      simpleTests(getNewStore)
    })

    describe('with helpers', () => {
      const getNewStore = () => createStore({
        data: {
          todos: keyValue({ key: 'id' }),
        },
        ui: {
          screens: {
            newTodo: simpleObject(),
          },
        },
      })

      simpleTests(getNewStore)
    })

    describe('with raw reducers', () => {
      const getNewStore = () => createStore({
        data: {
          todos: keyValue({ key: 'id' }),
        },
        ui: {
          config: (state = 'defaultState', action) => {
            switch (action.type) {
              case 'SET_CONFIG': return action.payload
              default: return state
            }
          },
          screens: {
            newTodo: simpleObject(),
          },
        },
      })

      simpleTests(getNewStore)

      it('should dispatch action to the raw reducer', () => {
        const store = getNewStore()

        // mutation
        store.dispatch({ type: 'SET_CONFIG', payload: 'new config' })

        // selection
        const { config } = store.getState().ui

        expect({
          state: store.getState(),
          config,
        }).toMatchSnapshot()
      })
    })

    describe('without custom options', () => {
      const getNewStore = options => createStore({
        data: {
          todos: { type: 'keyValue', key: 'id' },
        },
        ui: {
          screens: {
            newTodo: { type: 'simpleObject' },
          },
        },
      }, options)

      describe('middlewares', () => {
        it('should call middlewares', () => {
          const spy = jest.fn()
          const middleware = store => next => (action) => {
            spy({ state: store.getState(), action })
            next(action)
          }
          const store = getNewStore({ enhancer: compose(applyMiddleware(middleware)) })
          store.ui.screens.newTodo.set('new')

          expect({
            state: store.getState(),
            spy: spy.mock.calls,
          }).toMatchSnapshot()
        })
      })

      describe('init', () => {
        it('should init the state', () => {
          const store = getNewStore({
            init: {
              ui: {
                screens: {
                  newTodo: 'initial value!',
                },
              },
            },
          })

          expect({
            state: store.getState(),
          }).toMatchSnapshot()
        })
      })

      describe('hide redux', () => {
        it('should not mutate the state', () => {
          const store = getNewStore({ hideRedux: false })
          store.data.todos.add({ id: '3', label: 'hide-redux' })
          expect({
            state: store.getState(),
          }).toMatchSnapshot()
        })

        it('should dispatch action', () => {
          const store = getNewStore({ hideRedux: false })
          store.dispatch(store.data.todos.add({ id: '3', label: 'hide-redux' }))
          expect({
            state: store.getState(),
            todo: store.data.todos.get(3)(store.getState()),
          }).toMatchSnapshot()
        })
      })
    })
  })

  describe('bugs', () => {
    it('should works with first level reducers', () => {
      const store = createStore({
        label: { type: 'simpleObject' },
      })

      store.label.set('yeah it works')

      expect({
        state: store.getState(),
        label: store.label.get(),
      }).toMatchSnapshot()
    })
  })

  describe('listen middleware', () => {
    it('should works with others middlewares', () => {
      const spyCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        enhancer: compose(applyMiddleware(() => next => action => next(action))),
        listeners: [
          take(/SET_CONFIG/)(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
    })

    it('should still dispatch events', () => {
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [jest.fn()],
      })

      store.config.set('this is dispatched !')

      expect({
        state: store.getState(),
        config: store.config.get(),
      }).toMatchSnapshot()
    })

    it('should not catch action', () => {
      const spy = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [take('NO_CATCH')(spy)],
      })

      store.config.set('this is dispatched !')

      expect(spy.mock.calls.length).toBe(0)
    })

    it('should catch action -regexp-', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          take(/SET_CONFIG/)(spyCatch),
          take(/OUPS_CONFIG/)(spyNoCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyCatch.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch action -string-', () => {
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          take('@@krf/SET_CONFIG')(spyCatch),
          take('@@oups/SET_CONFIG')(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
    })

    it('should catch action -function-', () => {
      const spyFilter = jest.fn(() => true)
      const spyCatch = jest.fn()
      const spyNoCatch = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
      }, {
        listeners: [
          take(spyFilter)(spyCatch),
          take(() => false)(spyCatch),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spyCatch.mock.calls.length).toBe(1)
      expect(spyNoCatch.mock.calls.length).toBe(0)
      expect(spyFilter.mock.calls.length).toBe(1)
      expect(spyFilter.mock.calls[0]).toMatchSnapshot()
    })

    it('should catch and dispatch a new action', () => {
      const spy = jest.fn()
      const store = createStore({
        config: { type: 'simpleObject' },
        saved: { type: 'simpleObject' },
      }, {
        listeners: [
          take(/SET_SAVED/)(spy),
          take(/SET_CONFIG/)((action, innerStore) => { innerStore.saved.set('SET_CONFIG is triggered :)') }),
        ],
      })

      store.config.set('this is dispatched !')

      expect(spy.mock.calls.length).toBe(1)
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })
  })
}
