import { inject } from 'k-simple-state/react'
import Component from './footer'


export default inject(store => ({
  // data
  ...store.ui.footer.get(),
  filter: store.ui.filter.get(),
  // callbacks
  onClearCompleted: () => store.dispatch({ type: '@@ui/FOOTER_ON_CLEAR_COMPLETED' }),
  onClickAll: () => store.ui.filter.set('all'),
  onClickCompleted: () => store.ui.filter.set('completed'),
  onClickActive: () => store.ui.filter.set('active'),
}))(Component)
