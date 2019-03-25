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
  static displayName = `inject(${getWrappedDisplayName(WrappedComponent)})`

  static contextTypes = {
    store: () => null, // this is to avoid importing prop-types
  }

  constructor(props, context) {
    super(props, context)

    this.first = true
    this.reduxState = undefined
    this.state = {
      injectedProps: {},
    }
  }

  componentWillMount() {
    const { store } = this.context

    if (!store) {
      const bold = 'font-weight: bolder; font-style: italic;'
      // eslint-disable-next-line no-console
      console.error(
        `[k-ramel/react] Error in %cinject%c for the component %c${getWrappedDisplayName(WrappedComponent)}%c\n` +
        '\t> The store needs to be provided by an ancestor of this component.\n' +
        '\t> You can use %cprovider%c from %c@k-ramel/react%c or %cProvider%c from %creact-redux%c.\n\n' +
        'Check the documentation for an example at https://github.com/alakarteio/k-ramel#connect-it-with-reactjs\n',
        bold, '', bold, '', bold, '', bold, '', bold, '', bold, '',
      )
      return
    }
    this.store = store

    // run in once
    this.inject()

    // subscribe
    this.unsubscribe = store.subscribe(() => {
      // the state doesn't change, so we don't have to call containers
      if (this.store && this.reduxState === this.store.getState()) return

      this.inject()
    })
  }

  componentWillReceiveProps(nextProps) {
    if (shallowEqual(this.props, nextProps)) return

    this.inject(nextProps)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.first) return true

    const { injectedProps } = this.state // eslint-disable-line react/prop-types

    return !(
      shallowEqual(this.props, nextProps)
      && shallowEqual(
        withoutFunctions(nextState.injectedProps),
        withoutFunctions(injectedProps),
      )
    )
  }

  componentWillUnmount() {
    this.store = undefined
    this.unsubscribe()
  }

  inject = (nextProps) => {
    if (!this.store) return

    this.setState(state => ({
      ...state,
      injectedProps: injectFunction
        ? injectFunction(this.store, nextProps || this.props, this.store.drivers) || defaultObject
        : defaultObject,
    }))

    this.reduxState = this.store.getState()
  }

  render() {
    if (this.first) this.first = false

    const { injectedProps } = this.state

    return (
      <WrappedComponent
        /* this is parent props */
        {...this.props}
        /* this is injected props from hoc */
        {...injectedProps}
      />
    )
  }
}
