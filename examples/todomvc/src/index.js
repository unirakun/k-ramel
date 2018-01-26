import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.container'
import registerServiceWorker from './registerServiceWorker'

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
