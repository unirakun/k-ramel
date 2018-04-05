import React from 'react'
import createContext from './createContext'
import getWrappedDisplayName from './getWrappedDisplayName'

const defaultListeners = []

const toActionFactory = (name) => {
  const suffix = `${name ? '>' : ''}${name || ''}`
  return type => `@@krml/LISTENERS>${type}${suffix}`
}

const defaultObject = {}

const wrapper = (listeners, name) => (Component) => {
  const toAction = toActionFactory(name)

  return class extends React.Component {
    static displayName = `listen(${getWrappedDisplayName(Component)})`

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

      if (!store) {
        const bold = 'font-weight: bolder; font-style: italic;'
        // eslint-disable-next-line no-console
        console.error(
          `[k-ramel/react] Error in %clisten%c for the component %c${getWrappedDisplayName(Component)}%c\n` +
          '\t> The store needs to be provided by an ancestor of this component.\n' +
          '\t> You can use %cprovider%c from %c@k-ramel/react%c or %cProvider%c from %creact-redux%c.\n\n' +
          'Check the documentation for an example at https://github.com/alakarteio/k-ramel#connect-it-with-reactjs\n',
          bold, '', bold, '', bold, '', bold, '', bold, '', bold, '',
        )
        return
      }

      store.listeners.add(listeners)
      store.dispatch(toAction('ADDED'))
    }

    componentWillUnmount() {
      const { store } = this.props

      store.dispatch(toAction('REMOVING'))
      store.listeners.remove(listeners)
    }

    render() {
      return <Component {...this.props.ownProps} />
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

    WithConsumer.displayName = `consumer(${getWrappedDisplayName(WrappedComponent)})`

    return WithConsumer
  }
}
