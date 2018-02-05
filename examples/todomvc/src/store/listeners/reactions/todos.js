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
