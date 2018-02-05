import { createStore } from 'k-simple-state'
import listeners from './listeners'

export default createStore(
  {
    data: {
      todos: { type: 'keyValue', key: 'id' },
    },
    ui: {
      newTodo: { type: 'simpleObject', defaultData: '' },
    },
  },
  {
    listeners,
  },
)
