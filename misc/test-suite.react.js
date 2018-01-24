/* eslint-env jest */
/* eslint-disable
  react/jsx-filename-extension,
  react/prop-types
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
    it('should provide store as context', () => {
      const store = { this: 'is my store' }
      const App = (props, context) => <div>{JSON.stringify(context.store)}</div>
      App.contextTypes = { store: () => null }
      const Provided = provider(store)(App)
      const wrapper = mount(<Provided />)

      expect(wrapper.html()).toMatchSnapshot()
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
  })
}
