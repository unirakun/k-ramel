import { reaction } from 'k-simple-state'

export const load = reaction((action, store) => {
  store.data.todos.all.set([
    { id: 1, label: 'write README.md', completed: false },
    { id: 2, label: 'write other examples', completed: false },
  ])
})

export const add = reaction((action, store) => {
  const label = store.ui.newTodo.get()

  store.data.todos.all.add({ id: Date.now(), label, completed: false })
  store.ui.newTodo.reset()
})

export const clearNew = reaction((action, store) => {
  store.ui.newTodo.reset()
})

export const setNew = reaction((action, store) => {
  store.ui.newTodo.set(action.payload)
})

export const remove = reaction((action, store) => {
  store.data.todos.all.remove(action.payload)
})

export const toggleComplete = reaction((action, store) => {
  const todo = store.data.todos.all.get(action.payload)
  store.data.todos.all.update({ id: action.payload, completed: !todo.completed })
})

export const clearCompleted = reaction((action, store) => {
  const completed = store.data.todos.all.getBy('completed', true)

  store.data.todos.all.remove(completed.map(todo => todo.id))
})

export const updateViews = reaction((action, store) => {
  const completed = store.data.todos.all.getBy('completed', true)
  const active = store.data.todos.all.getBy('completed', false)

  store.data.todos.completed.set(completed)
  store.data.todos.active.set(active)
})

export const completeAll = reaction((action, store) => {
  const allCompleted = store.data.todos.all.getLength() === store.data.todos.completed.getLength()
  const todos = store.data.todos.all.getAsArray()
  store.data.todos.all.set(todos.map(todo => ({ ...todo, completed: !allCompleted })))
})
