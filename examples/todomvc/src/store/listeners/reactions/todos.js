import { reaction } from 'k-simple-state'

export const load = reaction((action, store) => {
  store.data.todos.set([
    { id: '1', label: 'write README.md' },
    { id: '2', label: 'write other examples' },
  ])
})
