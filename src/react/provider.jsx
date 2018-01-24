/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'

export default store => WrappedComponent => class extends Component {
  static displayName = `provider(${getWrappedDisplayName(WrappedComponent)})`

  static childContextTypes = {
    kStore: () => null, // this is to avoid importing prop-types
  }

  getChildContext() {
    return { kStore: store }
  }

  render() {
    return <WrappedComponent {...this.props} />
  }
}
