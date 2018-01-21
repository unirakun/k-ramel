/* eslint-env jest */
/* eslint-disable
  react/prop-types,
  jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions,
  react/jsx-filename-extension
*/
import React from 'react'
import { connect, Provider } from 'react-redux'
import { shallow } from 'enzyme'
import * as lib from './index'
import tests from './misc/test-suite'

tests(lib)

describe('react connection', () => {
  it('should connect redux store', () => {
    // base component
    const Component = ({ label, onClick }) => <div onClick={onClick}>test: {label}</div>

    // connected with redux
    const ReduxComponent = connect(
      ({ ui: { label } }) => ({ label }),
      dispatch => ({ onClick: dispatch({ type: 'CLICKED' }) }),
    )(Component)

    // create store with a middleware to make sure dispatch works
    const spy = jest.fn()
    const middleware = () => next => (action) => { spy(action); next(action) }
    const store = lib.createStore({
      ui: { label: { type: 'simpleObject', defaultData: 'data' } },
    }, {
      enhancer: lib.applyMiddleware(middleware),
      hideRedux: false,
    })

    // react app with store provided
    const App = () => <Provider store={store}><ReduxComponent /></Provider>

    // mount app and simulate a click to test both mapStateToProps and mapDispatchToProps
    const wrapper = shallow(<App />)
    wrapper.simulate('click')

    expect({
      html: wrapper.html(),
      actionDispatched: spy.mock.calls,
    }).toMatchSnapshot()
  })
})
