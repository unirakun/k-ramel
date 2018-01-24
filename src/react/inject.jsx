import React, { Component } from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'
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
    // subscribe
    this.unsubscribe = this.context.kStore.subscribe(() => {
      this.inject()
    })

    // run in once
    this.inject()
  }

  componentWillReceiveProps(nextProps) {
    this.readStore(nextProps)()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  inject = () => {
    const { injectedProps } = this.state
    const newInjectedProps = injectFunction(this.context.kStore, this.props)

    if (shallowEqual(injectedProps, newInjectedProps)) return

    this.setState(state => ({
      ...state,
      injectedProps: newInjectedProps,
    }))
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
