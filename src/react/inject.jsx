import React, { Component } from 'react'
import getWrappedDisplayName from './getWrappedDisplayName'

export default injectFunction => WrappedComponent => class extends Component {
  static displayName = `inject(${getWrappedDisplayName(WrappedComponent)}`

  static contextTypes = {
    kStore: () => null, // this is to avoid importing prop-types
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      injectedProps: {},
    }
  }

  componentWillMount() {
    const { kStore } = this.context

    this.unsubscribe = kStore.subscribe(() => {
      this.setState(state => ({
        ...state,
        injectedProps: injectFunction(kStore),
      }))
    })
  }

  componentWillReceiveProps(nextProps) {
    this.readStore(nextProps)()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <WrappedComponent
        /* this is parent props */
        {...this.props}
        /* this is injected props from hoc */
        {...this.state.injectedProps}
      />
    )
  }
}
