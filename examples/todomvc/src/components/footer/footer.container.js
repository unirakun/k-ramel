import { inject } from 'k-simple-state/react'
import Component from './footer'


export default inject(store => ({
  // data
  ...store.ui.footer.get(),
  // callbacks
  onClearCompleted: () => store.dispatch({ type: '@@ui/FOOTER_ON_CLEAR_COMPLETED' }),
}))(Component)
