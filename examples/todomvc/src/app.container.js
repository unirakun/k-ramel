import { provider } from 'k-simple-state/react'
import store from './store'
import App from './app'

export default provider(store)(App)
