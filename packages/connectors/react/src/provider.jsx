/* eslint-disable import/prefer-default-export */
import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'

export default store => (WrappedComponent) => {
  class ProvidedComponent extends Component {
    getChildContext() {
      return { store }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  ProvidedComponent.displayName = `provider(${getWrappedDisplayName(WrappedComponent)})`
  ProvidedComponent.childContextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  return ProvidedComponent
}
