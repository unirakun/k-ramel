import React from 'react'
import createContext from './createContext'
import getWrappedDisplayName from './getWrappedDisplayName'

const defaultListeners = []

const toActionFactory = (name) => {
  const suffix = `${name ? '>' : ''}${name || ''}`
  return type => `@@krml/LISTENERS>${type}${suffix}`
}

const defaultObject = {}

const wrapper = (listeners, name) => (WrappedComponent) => {
  const toAction = toActionFactory(name)

  return class extends React.Component {
    static propTypes = {
      store: () => null,
      ownProps: () => null,
    }

    static defaultProps = {
      store: undefined,
      ownProps: defaultObject,
    }

    componentDidMount() {
      const { store } = this.props

      store.listeners.add(listeners)
      store.dispatch(toAction('ADDED'))
    }

    componentWillUnmount() {
      const { store } = this.props

      store.dispatch(toAction('REMOVING'))
      store.listeners.remove(listeners)
    }

    render() {
      return <WrappedComponent {...this.props.ownProps} />
    }
  }
}

export default (listeners = defaultListeners, name) => {
  const { Consumer } = createContext()

  const withListeners = wrapper(listeners, name)

  return (Component) => {
    const WrappedComponent = withListeners(Component)

    const WithConsumer = props => (
      <Consumer>
        {store => <WrappedComponent ownProps={props} store={store} />}
      </Consumer>
    )

    WithConsumer.displayName = `listen(${getWrappedDisplayName(Component)}`

    return WithConsumer
  }
}
