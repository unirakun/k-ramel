import { reaction } from 'k-simple-state'

export const load = reaction((action, store) => {
  store.data.todos.set([
    { id: 1, label: 'write README.md' },
    { id: 2, label: 'write other examples' },
  ])
})

export const add = reaction((action, store) => {
  const label = store.ui.newTodo.get()

  store.data.todos.add({ id: Date.now(), label })
  store.ui.newTodo.reset()
})

export const clearNew = reaction((action, store) => {
  store.ui.newTodo.reset()
})

export const setNew = reaction((action, store) => {
  store.ui.newTodo.set(action.payload)
})

export const remove = reaction((action, store) => {
  store.data.todos.remove(action.payload)
})

export const toggleComplete = reaction((action, store) => {
  const todo = store.data.todos.get(action.payload)
  store.data.todos.update({ id: action.payload, completed: !todo.completed })
})
