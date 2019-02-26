/* eslint-env jest */
/* eslint-disable
  react/jsx-filename-extension,
  react/prop-types,
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions
*/
import React from 'react'
import { mount } from 'enzyme'
import { createStore } from 'k-ramel'

export default (lib) => {
  const {
    provider,
    inject,
    listen,
  } = lib

  describe('react', () => {
    it('should works with undefined listeners', () => {
      // store
      const add = jest.fn()
      const remove = jest.fn()
      const dispatch = jest.fn()
      const store = {
        listeners: {
          add,
          remove,
        },
        dispatch,
      }

      // tested component
      const DummyComponent = () => <div>Dummy</div>
      const WrappedComponent = listen()(DummyComponent)

      // mount
      const wrapper = mount(<WrappedComponent />, { context: { store } })
      expect(wrapper.find('div').text()).toEqual('Dummy')
      expect(add.mock.calls.length).toBe(1)
      expect(remove.mock.calls.length).toBe(0)

      // unmount
      wrapper.unmount()
      expect(add.mock.calls.length).toBe(1)
      expect(remove.mock.calls.length).toBe(1)

      // listeners are in call
      expect(add.mock.calls[0][0]).toEqual([])
      expect(remove.mock.calls[0][0]).toEqual([])
    })

    it('should dispatch events at mount with a given name', () => {
      // store
      const dispatch = jest.fn()
      const store = {
        listeners: {
          add: jest.fn(),
          remove: jest.fn(),
        },
        dispatch,
      }

      // tested component
      const DummyComponent = () => <div>Dummy</div>
      const listeners = []
      const WrappedComponent = listen(listeners, 'my-name')(DummyComponent)

      // mount
      const wrapper = mount(<WrappedComponent />, { context: { store } })
      expect(dispatch.mock.calls.length).toBe(1)

      // unmount
      wrapper.unmount()
      expect(dispatch.mock.calls.length).toBe(2)

      // snap dispatched action
      expect({
        dispatch: dispatch.mock.calls,
      }).toMatchSnapshot()
    })

    it('should add listeners at mount', () => {
      // store
      const add = jest.fn()
      const remove = jest.fn()
      const dispatch = jest.fn()
      const store = {
        listeners: {
          add,
          remove,
        },
        dispatch,
      }

      // tested component
      const DummyComponent = () => <div>Dummy</div>
      const listeners = [() => { console.log('listen1') }, () => { console.log('listen2') }]
      const WrappedComponent = listen(listeners)(DummyComponent)

      // mount
      const wrapper = mount(<WrappedComponent />, { context: { store } })
      expect(wrapper.find('div').text()).toEqual('Dummy')
      expect(add.mock.calls.length).toBe(1)
      expect(remove.mock.calls.length).toBe(0)
      expect(dispatch.mock.calls.length).toBe(1)

      // unmount
      wrapper.unmount()
      expect(add.mock.calls.length).toBe(1)
      expect(remove.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls.length).toBe(2)

      // listeners are in call
      expect(add.mock.calls[0][0]).toBe(listeners)
      expect(remove.mock.calls[0][0]).toBe(listeners)

      // snap dispatched action
      expect({
        dispatch: dispatch.mock.calls,
      }).toMatchSnapshot()
    })

    it('should provide store as context', () => {
      const store = { this: 'is my store' }
      const App = (props, context) => <div>{JSON.stringify(context.store)}</div>
      App.contextTypes = { store: () => null }
      const Provided = provider(store)(App)
      const wrapper = mount(<Provided />)

      expect({
        html: wrapper.html(),
      }).toMatchSnapshot()
    })

    it('should inject store to a component', () => {
      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
      })

      // tested component
      const Component = ({ label }) => <div>{label}</div>
      const WrappedComponent = inject(store => ({ label: store.config.get() }))(Component)

      // test
      testStore.config.set('a label')
      const wrapper = mount(<WrappedComponent />, { context: { store: testStore } })
      expect(wrapper.find('div').html()).toMatchSnapshot()
    })

    it('should not throw an exception if no provider is part of parents', () => {
      const { error } = console
      /* eslint-disable no-console */
      console.error = jest.fn()

      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
      })

      // tested component
      const Component = ({ label }) => <div>{label}</div>
      const WrappedComponent = inject(store => ({ label: store.config.get() }))(Component)

      // test
      testStore.config.set('a label')
      mount(<WrappedComponent />)
      expect(console.error.mock.calls).toMatchSnapshot()

      console.error = error
      /* eslint-enable no-console */
    })

    it('should not throw when using inject without params', () => {
      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
      })

      const Component = () => <div />
      const WrappedComponent = inject()(Component)

      // test
      mount(<WrappedComponent />, { context: { store: testStore } })
    })

    it('should not throw when inject function return undefined', () => {
      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
      })

      // tested component
      const Component = () => <div />
      const WrappedComponent = inject(() => {})(Component)

      // test
      mount(<WrappedComponent />, { context: { store: testStore } })
    })

    it('should inject callbacks', () => {
      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
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
        config: { type: 'simple.object' },
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
        config: { type: 'simple.object' },
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
        config: { type: 'simple.object' },
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

    it('should be optimized to not re-render nor recall mapStore to often', () => {
      // store
      const testStore = createStore({
        config: { type: 'simple.object' },
        dummy: { type: 'simple.object' },
      })

      // tested component
      const spy = jest.fn()
      const Component = ({ label, parentProp }) => {
        spy()
        return <div>{label}-{parentProp}</div>
      }
      const mapStore = jest.fn(store => ({
        label: store.config.get(),
        fn: () => {},
      }))
      const WrappedComponent = inject(mapStore)(Component)

      // try to render and wrapped component
      // 1. mapStore is called because state is modified
      // 2. component is rerendered because mapStore depends on store.config
      testStore.config.set('a label')
      const mounted = mount(<WrappedComponent />, { context: { store: testStore } })
      // expect
      expect(spy.mock.calls.length).toBe(1)
      expect(mapStore.mock.calls.length).toBe(1)

      // 1. mapStore is called because state is modified
      // 2. component is NOT rerendered because mapStore does NOT depend on store.dummy
      testStore.dummy.set('this should not trigger a re-render')
      // expect
      expect(spy.mock.calls.length).toBe(1)
      expect(mapStore.mock.calls.length).toBe(2)

      // 1. mapStore is NOT called because state is NOT modified
      // 2. component is NOT rerendered because mapStore does NOT depend on store.dummy
      testStore.dispatch('@@dummy>ACTION')
      // expect
      expect(spy.mock.calls.length).toBe(1)
      expect(mapStore.mock.calls.length).toBe(2)

      // 1. mapStore is called because parent prop is modified
      // 2. component is rerendered because parent prop is modified
      const parentProp = 'new value'
      mounted.setProps({ parentProp })
      // expect
      expect(spy.mock.calls.length).toBe(2)
      expect(mapStore.mock.calls.length).toBe(3)

      // 1. mapStore is NOT called because parent prop is NOT modified
      // 2. component is NOT rerendered because parent prop is NOT modified
      mounted.setProps({ parentProp })
      // expect
      expect(spy.mock.calls.length).toBe(2)
      expect(mapStore.mock.calls.length).toBe(3)
    })
  })
}
