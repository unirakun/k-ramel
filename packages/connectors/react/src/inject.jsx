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

  static getDerivedStateFromProps(nextProps, prevState) {
    const injectedProps = getInjectedProps(nextProps)
    if (!injectedProps) return null

    return { ...prevState, injectedProps }
  }

  constructor(props, context) {
    super(props, context)
    this.first = true

    // attach store
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
    this.state = {
      ...this.state,
      injectedProps: this.getInjectedProps() || {},
    }

    // subscribe
    this.unsubscribe = store.subscribe(() => {
      const injectedProps = this.getInjectedProps()
      if (this.setState && injectedProps) {
        this.setState(state => ({ ...state, injectedProps }))
      }
    })
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
    this.store = undefined
    this.unsubscribe()
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
