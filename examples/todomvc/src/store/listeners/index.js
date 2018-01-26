import { when } from 'k-simple-state'
import { todos } from './reactions'

export default [
  when('@@ui/APP_LOADED')(todos.load),
]
