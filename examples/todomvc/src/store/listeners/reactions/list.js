import { reaction } from 'k-simple-state'

export const update = reaction((action, store) => {
  const { filter } = store.ui.footer.get()
  store.ui.keys.set(store.data.todos[filter].getKeys())
})
