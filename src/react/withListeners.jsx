import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'

const defaultListeners = []

export default (listeners = defaultListeners) => WrappedComponent => class extends Component {
  static displayName = `withListeners(${getWrappedDisplayName(WrappedComponent)}`

  static contextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  componentWillMount() {
    this.context.store.listeners.add(listeners)
  }

  componentWillUnmount() {
    this.context.store.listeners.remove(listeners)
  }

  render() {
    return <WrappedComponent {...this.props} />
  }
}
