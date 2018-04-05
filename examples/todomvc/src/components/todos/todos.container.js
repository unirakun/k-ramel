import { compose } from 'recompose'
import { inject, listen } from '@k-ramel/react'
import Component from './todos'
import listeners from './todos.listeners'

export default compose(
  inject(store => ({
    todos: store.ui.views[store.ui.footer.get().filter].get(),
    allCompleted: store.ui.footer.get().todosLeft === 0,
    onCompleteAll: () => store.dispatch('@@ui/HEADER_ON_COMPLETE_ALL'),
  })),
  listen(listeners, 'NAME'),
)(Component)
