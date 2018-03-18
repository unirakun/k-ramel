import { inject } from '@k-ramel/react'
import Component from './todos'

export default inject(store => ({
  todos: store.ui.views[store.ui.footer.get().filter].get(),
  allCompleted: store.ui.footer.get().todosLeft === 0,
  onCompleteAll: () => store.dispatch('@@ui/HEADER_ON_COMPLETE_ALL'),
}))(Component)
