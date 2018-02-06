import { inject } from 'k-simple-state/react'
import Component from './todos'

export default inject(store => ({
  todos: store.data.todos[store.ui.footer.get().filter].getKeys(),
  allCompleted: store.data.todos.all.getLength() === store.data.todos.completed.getLength(),
  onCompleteAll: () => store.dispatch({ type: '@@ui/HEADER_ON_COMPLETE_ALL' }),
}))(Component)
