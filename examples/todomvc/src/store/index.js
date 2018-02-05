import { createStore } from 'k-simple-state'
import listeners from './listeners'

export default createStore(
  {
    data: {
      todos: { type: 'keyValue', key: 'id' },
    },
    ui: {
      footer: { type: 'simpleObject', defaultData: { todos: 0, todosLeft: 0, todosCompleted: 0 } },
      newTodo: { type: 'simpleObject', defaultData: '' },
    },
  },
  {
    listeners,
  },
)
