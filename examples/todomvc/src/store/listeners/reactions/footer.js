import { reaction } from 'k-simple-state'

export const updateCounts = reaction((action, store) => {
  const todos = store.data.todos.all.getAsArray()
  const completedTodos = store.data.todos.all.getBy('completed', true)

  // count todos
  const { length } = todos
  const completed = completedTodos.length
  const left = length - completed

  // store it
  store.ui.footer.update({ todos: length, todosLeft: left, todosCompleted: completed })
})
