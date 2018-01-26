import { provider, inject } from 'k-simple-state/react'
import { compose } from 'recompose'
import loader from 'hoc-react-loader'
import store from './store'
import App from './app'

export default compose(
  provider(store),
  inject(st => ({ load: () => { st.dispatch({ type: '@@ui/APP_LOADED' }) } })),
  loader(),
)(App)
