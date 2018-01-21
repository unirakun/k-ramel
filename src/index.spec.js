/* eslint-env jest */
import { createStore, simpleObject, keyValue, applyMiddleware } from './index'

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
        const store = getNewStore({ enhancer: applyMiddleware(middleware) })
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
