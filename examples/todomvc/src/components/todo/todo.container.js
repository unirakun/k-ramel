import { inject } from 'k-simple-state/react'
import Component from './todo'

export default inject((store, { id }) => ({
  // data
  ...store.data.todos.all.get(id),
  // callbacks
  onRemove: () => store.dispatch({ type: '@@ui/TODO_ON_REMOVE', payload: id }),
  onComplete: () => store.dispatch({ type: '@@ui/TODO_ON_COMPLETE', payload: id }),
}))(Component)
