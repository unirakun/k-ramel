import { createStore, simpleObject, keyValue } from 'k-ramel'
import listeners from './listeners'

export default createStore(
  {
    data: {
      todos: keyValue({ key: 'id' }), // or you can create with if you want to serialize it : { type: 'keyValue', key: 'id' }
    },
    ui: {
      views: {
        all: simpleObject({ defaultData: [] }),
        completed: simpleObject({ defaultData: [] }),
        active: simpleObject({ defaultData: [] }),
      },
      footer: simpleObject({
        defaultData: {
          todos: 0,
          todosLeft: 0,
          todosCompleted: 0,
          filter: 'all',
        },
      }),
      newTodo: simpleObject({ defaultData: '' }),
    },
  },
  {
    listeners,
  },
)
