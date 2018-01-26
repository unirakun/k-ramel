import { inject } from 'k-simple-state/react'
import Component from './todos'

export default inject(store => ({ todos: store.data.todos.getKeys() }))(Component)
