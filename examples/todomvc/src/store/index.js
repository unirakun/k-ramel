import { createStore, simpleObject, keyValue } from 'k-simple-state'
import listeners from './listeners'

export default createStore(
  {
    data: {
      todos: {
        all: { type: 'keyValue', key: 'id' },
        completed: keyValue({ key: 'id' }),
        active: keyValue({ key: 'id' }),
      },
    },
    ui: {
      footer: simpleObject({
        defaultData: {
          todos: 0,
          todosLeft: 0,
          todosCompleted: 0,
          filter: 'all',
        },
      }),
      newTodo: { type: 'simpleObject', defaultData: '' },
    },
  },
  {
    listeners,
  },
)
