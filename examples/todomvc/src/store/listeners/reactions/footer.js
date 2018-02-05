import { reaction } from 'k-simple-state'

export const updateCounts = reaction((action, store) => {
  const todos = store.data.todos.all.getAsArray()

  // numbers
  const { length } = todos
  const completed = todos.filter(todo => !!todo.completed).length
  const left = length - completed

  // store it
  store.ui.footer.update({ todos: length, todosLeft: left, todosCompleted: completed })
})
