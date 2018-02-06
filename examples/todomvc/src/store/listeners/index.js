import { when } from 'k-simple-state'
import { todos, footer } from './reactions'

export default [
  when('@@ui/APP_LOADED')(todos.load),
  when('@@ui/ADD_TODO_KEYDOWN', action => action.payload === 13)(todos.add),
  when('@@ui/ADD_TODO_KEYDOWN', action => action.payload === 27)(todos.clearNew),
  when('@@ui/ADD_TODO_CHANGE')(todos.setNew),
  when('@@ui/TODO_ON_REMOVE')(todos.remove),
  when('@@ui/TODO_ON_COMPLETE')(todos.toggleComplete),
  when('@@ui/FOOTER_ON_CLEAR_COMPLETED')(todos.clearCompleted),
  when(/@@krf\/.*_ALL/)(footer.updateCounts),
  when(/@@krf\/.*_ALL/)(todos.updateViews),
  when('@@ui/HEADER_ON_COMPLETE_ALL')(todos.completeAll),
]
