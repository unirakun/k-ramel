/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'

export default store => WrappedComponent => class extends Component {
  static displayName = `provider(${getWrappedDisplayName(WrappedComponent)})`

  static childContextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  getChildContext() {
    return { store }
  }

  componentWillMount() {
    store.dispatch('@@kst/INIT')
  }

  render() {
    return <WrappedComponent {...this.props} />
  }
}
