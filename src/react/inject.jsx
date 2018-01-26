import React, { Component } from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'
import getWrappedDisplayName from './getWrappedDisplayName'

const withoutFunctions = object => Object
  .keys(object)
  .reduce((acc, key) => {
    const value = object[key]
    if (typeof value === 'function') return acc
    return { ...acc, [key]: value }
  })


export default injectFunction => WrappedComponent => class extends Component {
  static displayName = `inject(${getWrappedDisplayName(WrappedComponent)}`

  static contextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      injectedProps: {},
    }
  }

  componentWillMount() {
    // subscribe
    this.unsubscribe = this.context.store.subscribe(() => {
      this.inject()
    })

    // run in once
    this.inject()
  }

  componentWillReceiveProps(nextProps) {
    this.inject(nextProps)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  inject = (nextProps) => {
    const { injectedProps } = this.state
    const newInjectedProps = injectFunction(this.context.store, nextProps || this.props)

    if (
      shallowEqual(this.props, nextProps)
      && shallowEqual(
        withoutFunctions(injectedProps),
        withoutFunctions(newInjectedProps),
      )
    ) { return }

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
