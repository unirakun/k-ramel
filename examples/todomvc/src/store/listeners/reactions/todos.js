export const load = (action, store) => {
  store.data.todos.set([
    { id: 1, label: 'write README.md', completed: false },
    { id: 2, label: 'write other examples', completed: false },
  ])
}

export const add = (action, store) => {
  const label = store.ui.newTodo.get()

  store.data.todos.add({ id: Date.now(), label, completed: false })
  store.ui.newTodo.reset()
}

export const clearNew = (action, store) => {
  store.ui.newTodo.reset()
}

export const setNew = (action, store) => {
  store.ui.newTodo.set(action.payload)
}

export const remove = (action, store) => {
  store.data.todos.remove(action.payload)
}

export const toggleComplete = (action, store) => {
  const todo = store.data.todos.get(action.payload)
  store.data.todos.update({ id: action.payload, completed: !todo.completed })
}

export const clearCompleted = (action, store) => {
  store.data.todos.remove(store.ui.views.completed.get())
}

export const updateViews = (action, store) => {
  const todos = store.data.todos.getAsArray()
  const completed = todos.filter(t => t.completed).map(t => t.id)
  const active = todos.filter(t => !t.completed).map(t => t.id)

  store.ui.views.all.set(todos.map(t => t.id))
  store.ui.views.completed.set(completed)
  store.ui.views.active.set(active)

  store.dispatch('@@ui/VIEWS/UPDATED')
}

export const completeAll = (action, store) => {
  const todos = store.data.todos.getAsArray()
  const allCompleted = todos.length === store.ui.views.completed.get().length
  store.data.todos.set(todos.map(todo => ({ ...todo, completed: !allCompleted })))
}
