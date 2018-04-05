import React from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'
import getWrappedDisplayName from './getWrappedDisplayName'
import createContext from './createContext'

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

const getDerivedStateFromProps = injectFunction => (nextProps, prevState) => {
  const { store } = prevState

  // get props derivated from redux state
  const injectedProps = injectFunction(store, nextProps.ownProps, store.drivers)

  console.log('get derivated')
  // no modifications ?
  if (
    shallowEqual(
      withoutFunctions(prevState.injectedProps),
      withoutFunctions(injectedProps),
    )
  ) return null

  return { ...prevState, injectedProps, state: store.getState() }
}

const wrapper = injectFunction => Component => class extends React.Component {
  static getDerivedStateFromProps = getDerivedStateFromProps(injectFunction)

  constructor(props) {
    super(props)

    const { store } = props

    this.mounted = false
    this.state = getDerivedStateFromProps(injectFunction)(
      this.props,
      {
        // needed for first call (where we shallow compare old and new one)
        injectedProps: defaultObject,
        // store needed to call injectFunction
        store,
      },
    )

    console.log('constructor', Component.displayName)
  }

  componentDidMount() {
    console.log('didmount', Component.displayName)

    const { store } = this.props

    this.unsubscribe = store.subscribe(() => {
      console.log('subscribe', Component.displayName)
      if (this.state.state !== store.getState()) {
        const newState = getDerivedStateFromProps(injectFunction)(this.props, this.state)
        console.log('get derivated - subscribe', Component.displayName)

        if (newState !== null) {
          if (!this.mounted) this.state = newState
          else this.setState(newState)
        }
      }
    })
  }

  componentWillUnmount() {
    console.log('unmount')
    this.unsubscribe()
  }

  render() {
    const { ownProps, injectedProps } = this.state

    this.mounted = true

    return (
      <Component
        {...ownProps}
        {...injectedProps}
      />
    )
  }
}

export default (injectFunction) => {
  const { Consumer } = createContext()
  const withInjectFunction = wrapper(injectFunction)

  return (Component) => {
    const WrappedComponent = withInjectFunction(Component)

    const WithConsumer = props => (
      <Consumer>
        {(store) => {
          console.log('new store from context', WithConsumer.displayName)
          return <WrappedComponent ownProps={props} store={store} />
        }}
      </Consumer>
    )

    WithConsumer.displayName = `inject(${getWrappedDisplayName(Component)}`

    console.log('hoc', WithConsumer.displayName)

    return WithConsumer
  }
}
