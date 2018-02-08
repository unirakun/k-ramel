import { provider } from 'k-ramel/react'
import store from './store'
import App from './app'

export default provider(store)(App)
