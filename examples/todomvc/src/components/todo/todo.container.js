import { inject } from 'k-simple-state/react'
import Component from './todo'

export default inject((store, { id }) => store.data.todos.get(id))(Component)
