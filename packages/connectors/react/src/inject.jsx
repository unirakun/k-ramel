import React, { Component } from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'
import getWrappedDisplayName from './getWrappedDisplayName'

const defaultObject = {}
const withoutFunctions = object => Object
  .keys(object)
  .reduce(
    (acc, key) => {
      const value = object[key]
      if (typeof value === 'function') return acc
      return { ...acc, [key]: value }
    },
    defaultObject,
  )

export default injectFunction => WrappedComponent => class extends Component {
  static displayName = `inject(${getWrappedDisplayName(WrappedComponent)}`

  static contextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  constructor(props, context) {
    super(props, context)

    this.first = true
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

  shouldComponentUpdate(nextProps, nextState) {
    if (this.first) return true

    return !(
      shallowEqual(this.props, nextProps)
      && shallowEqual(
        withoutFunctions(nextState.injectedProps),
        withoutFunctions(this.state.injectedProps),
      )
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  inject = (nextProps) => {
    this.setState(state => ({
      ...state,
      injectedProps: injectFunction(this.context.store, nextProps || this.props),
    }))
  }

  render() {
    if (this.first) this.first = false

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
