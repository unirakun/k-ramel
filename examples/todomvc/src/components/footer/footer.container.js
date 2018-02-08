import { inject } from 'k-ramel/react'
import Component from './footer'


export default inject(store => ({
  // data
  ...store.ui.footer.get(),
  // callbacks
  onClearCompleted: () => store.dispatch('@@ui/FOOTER_ON_CLEAR_COMPLETED'),
  onClickAll: () => store.ui.footer.update({ filter: 'all' }),
  onClickCompleted: () => store.ui.footer.update({ filter: 'completed' }),
  onClickActive: () => store.ui.footer.update({ filter: 'active' }),
}))(Component)
