import { createStore, types } from 'k-ramel'
import listeners from './listeners'

export default createStore(
  {
    data: {
      todos: types.keyValue({ key: 'id' }), // or you can create it this way if you want to serialize it : { type: 'keyValue', key: 'id' }
    },
    ui: {
      views: {
        all: types.array(),
        completed: types.array(),
        active: types.array(),
      },
      footer: types.object({
        defaultData: {
          todos: 0,
          todosLeft: 0,
          todosCompleted: 0,
          filter: 'all',
        },
      }),
      newTodo: types.string(),
    },
  },
  {
    listeners,
  },
)
