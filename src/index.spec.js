/* eslint-env jest */
import { createStore, simpleObject, keyValue } from './index'

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

const getNewStoreWithHelpers = () => createStore({
  data: {
    todos: keyValue({ key: 'id' }),
  },
  ui: {
    screens: {
      newTodo: simpleObject(),
    },
  },
})

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
        state: store.getState(),
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

  describe('configuration with plain object', () => simpleTests(getNewStore))

  describe('configuration with helpers', () => simpleTests(getNewStoreWithHelpers))
})
