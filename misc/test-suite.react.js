/* eslint-env jest */
/* eslint-disable
  react/jsx-filename-extension,
  react/prop-types,
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions
*/
import React from 'react'
import { mount } from 'enzyme'
import { createStore } from '../index'

export default (lib) => {
  const {
    provider,
    inject,
  } = lib

  describe('react', () => {
    it('should provide store as context and dispatch an INIT event', () => {
      const dispatch = jest.fn()
      const store = { this: 'is my store', dispatch }
      const App = (props, context) => <div>{JSON.stringify(context.store)}</div>
      App.contextTypes = { store: () => null }
      const Provided = provider(store)(App)
      const wrapper = mount(<Provided />)

      expect({
        html: wrapper.html(),
        dispatch: dispatch.mock.calls,
      }).toMatchSnapshot()
    })

    it('should inject store to a component', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
      })

      // tested component
      const Component = ({ label }) => <div>{label}</div>
      const WrappedComponent = inject(store => ({ label: store.config.get() }))(Component)

      // test
      testStore.config.set('a label')
      const wrapper = mount(<WrappedComponent />, { context: { store: testStore } })
      expect(wrapper.find('div').html()).toMatchSnapshot()
    })

    it('should inject callbacks', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
      })

      // tested component
      const Component = ({ onClick }) => <div onClick={onClick} />
      const WrappedComponent = inject(store => ({ onClick: () => store.config.set('clicked !') }))(Component)

      // test
      const wrapper = mount(<WrappedComponent />, { context: { store: testStore } })
      wrapper.find('div').simulate('click')
      expect(testStore.config.get()).toEqual('clicked !')
    })

    it('should refresh when store changes', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
      })

      // tested component
      const Component = ({ label }) => <div>{label}</div>
      const WrappedComponent = inject(store => ({ label: store.config.get() }))(Component)

      // test
      testStore.config.set('a label')
      const wrapper = mount(<WrappedComponent />, { context: { store: testStore } })
      testStore.config.set('an other label')

      expect(wrapper.find('div').html()).toMatchSnapshot()
    })

    it('should refresh when props changes', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
      })

      // tested component
      const Component = ({ label, id }) => <div>{label}-{id}</div>
      const WrappedComponent = inject((store, ownProps) => ({
        label: store.config.get(),
        id: ownProps.id,
      }))(Component)

      // test
      testStore.config.set('a label')
      const wrapper = mount(<WrappedComponent id={3} />, { context: { store: testStore } })
      wrapper.setProps({ id: 2 })

      expect(wrapper.find('div').html()).toMatchSnapshot()
    })

    it('should unsubscribe on unmount', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
      })

      // tested component
      const Component = ({ label }) => <div>{label}</div>
      const WrappedComponent = inject(store => ({ label: store.config.get() }))(Component)

      // test
      testStore.config.set('a label')
      const wrapper = mount(<WrappedComponent />, { context: { store: testStore } })
      wrapper.unmount()

      testStore.config.set('an other label')
    })

    it('should not refresh component when there is no change', () => {
      // store
      const testStore = createStore({
        config: { type: 'simpleObject' },
        dummy: { type: 'simpleObject' },
      })

      // tested component
      const spy = jest.fn()
      const Component = ({ label }) => {
        spy()
        return <div>{label}</div>
      }
      const WrappedComponent = inject(store => ({
        label: store.config.get(),
        fn: () => {},
      }))(Component)

      // try to render and wrapped component
      testStore.config.set('a label')
      mount(<WrappedComponent />, { context: { store: testStore } })
      testStore.dummy.set('this should not trigger a re-render')

      // only one render
      expect(spy.mock.calls.length).toBe(1)
    })
  })
}
