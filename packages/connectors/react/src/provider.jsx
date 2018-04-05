/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'
import createContext from './createContext'

export default (store) => {
  const { Provider } = createContext()

  return WrappedComponent => class extends Component {
    static displayName = `provider(${getWrappedDisplayName(WrappedComponent)})`

    componentWillMount() {
      store.dispatch('@@krml/INIT')
    }

    render() {
      return (
        <Provider value={store}>
          <WrappedComponent {...this.props} />
        </Provider>
      )
    }
  }
}
