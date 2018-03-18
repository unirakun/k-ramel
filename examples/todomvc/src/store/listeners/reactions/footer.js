import { reaction } from 'k-ramel'

export const updateCounts = reaction((action, store) => {
  const all = store.ui.views.all.get().length
  const completed = store.ui.views.completed.get().length

  // count todos
  const left = all - completed

  // store it
  store.ui.footer.update({ todos: all, todosLeft: left, todosCompleted: completed })
})
