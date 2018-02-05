import { when } from 'k-simple-state'
import { todos } from './reactions'

export default [
  when('@@ui/APP_LOADED')(todos.load),
  when('@@ui/ADD_TODO_KEYDOWN', action => action.payload === 13)(todos.add),
  when('@@ui/ADD_TODO_KEYDOWN', action => action.payload === 27)(todos.clearNew),
]
