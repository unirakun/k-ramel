import { inject } from 'k-simple-state/react'
import Component from './header'


export default inject(store => ({
  // data
  newTodo: store.ui.newTodo.get(),
  // callbacks
  onKeyDown: e => store.dispatch({ type: '@@ui/ADD_TODO_KEYDOWN', payload: e.keyCode }),
  onChange: e => store.ui.newTodo.set(e.target.value),
}))(Component)
