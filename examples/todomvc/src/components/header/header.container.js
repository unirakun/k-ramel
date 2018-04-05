import { inject } from '@k-ramel/react'
import Component from './header'


export default inject((store) => {
  console.log('header.container')

  return {
    // data
    newTodo: store.ui.newTodo.get(),
    // callbacks
    onKeyDown: e => store.dispatch({ type: '@@ui/ADD_TODO_KEYDOWN', payload: e.keyCode }),
    onChange: e => store.dispatch({ type: '@@ui/ADD_TODO_CHANGE', payload: e.target.value }),
  }
})(Component)
