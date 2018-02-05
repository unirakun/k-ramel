import { inject } from 'k-simple-state/react'
import Component from './header'


export default inject(store => ({
  newTodo: store.ui.newTodo.get(),
  onKeyDown: e => store.ui.newTodo.set(e.target.value),
  addTodo: () => store.dispatch({ type: '@@ui/ADD_TODO_CLICKED' }),
}))(Component)
