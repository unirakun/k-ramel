/* eslint-env jest */
/* eslint-disable react/jsx-filename-extension */
import { createStore as krmlCreateStore, when } from 'k-ramel'
import React from 'react'
import { mount } from 'enzyme'
import { reducer } from 'redux-form'
import makeComponent from './form'
import { actionNames } from '../src/actions'
import { selectorNames } from '../src/selectors'

export default (driver) => {
  const createStore = (description, options, getFormState) => krmlCreateStore(
    description,
    {
      ...options,
      drivers: {
        ...options.drivers,
        reduxform: driver(getFormState),
      },
    },
  )

  describe('drivers', () => {
    describe('redux-form', () => {
      it('should dispatch action', () => {
        // dispatch spy
        const spy = jest.fn()

        // store
        const store = createStore(
          {
            form: reducer,
          },
          {
            listeners: [
              when('DISPATCHED')((action, st, { reduxform }) => {
                actionNames
                  .filter(a => !a.includes('arraySwap'))
                  .forEach(a => reduxform('form')[a]('field1'))
                // exclude arraySwap because this action have mandatory parameters.
                reduxform('form').arraySwap('field1', 1, 0)
              }),
              when(() => true)(action => spy(action)),
            ],
          },
        )

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })

        // assert
        expect({
          dispatch: spy.mock.calls,
        }).toMatchSnapshot()
      })

      it('should dispatch async submit and submit succeeded', async () => {
        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore(
          {
            form: reducer,
          },
          {
            listeners: [
              when('DISPATCHED')((action, st, { reduxform }) => {
                reduxform('form').asyncSubmit(() => {
                  st.dispatch({ type: 'ASYNC_SUBMIT' })
                  reduxform('form').setSubmitSucceeded()
                })
                resolver()
              }),
              when(() => true)(action => spy(action)),
            ],
          },
        )

        // mount basic form
        const Component = makeComponent(store, { field1: 'value1', field2: 'value2' })
        mount(<Component />)

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
        }).toMatchSnapshot()
      })

      it('should dispatch async submit and submit failed', async () => {
        // dispatch spy
        const spy = jest.fn()

        // wait
        let resolver
        const wait = new Promise((resolve) => { resolver = resolve })

        // store
        const store = createStore(
          {
            form: reducer,
          },
          {
            listeners: [
              when('DISPATCHED')((action, st, { reduxform }) => {
                reduxform('form').asyncSubmit(() => {
                  st.dispatch({ type: 'ASYNC_SUBMIT' })
                  reduxform('form').setSubmitFailed()
                })
                resolver()
              }),
              when(() => true)(action => spy(action)),
            ],
          },
        )

        // mount basic form
        const Component = makeComponent(store, { field1: 'value1', field2: 'value2' })
        mount(<Component />)

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })
        await wait

        // assert
        expect({
          dispatch: spy.mock.calls,
        }).toMatchSnapshot()
      })

      it('should select form', () => {
        // spy
        let results = {}

        // store
        const store = createStore(
          {
            form: reducer,
          },
          {
            listeners: [
              when('DISPATCHED')((action, st, { reduxform }) => {
                results = selectorNames
                  .filter(s => !s.includes('getFormNames'))
                  .reduce((acc, cur) => ({ [cur]: reduxform('form')[cur]('form'), ...acc }), {})
                results = { getFormNames: reduxform('form').getFormNames(), ...results }
              }),
            ],
          },
        )

        // mount basic form
        const Component = makeComponent(store, { field1: 'value1', field2: 'value2' })
        mount(<Component />)

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })

        // assert
        expect({
          results,
        }).toMatchSnapshot()
      })

      it('should select form with other path of form state', () => {
        // spy
        let results = {}

        // store
        const store = createStore(
          {
            ui: { form: reducer },
          }, {
            listeners: [
              when('DISPATCHED')((action, st, { reduxform }) => {
                results = selectorNames
                  .filter(s => !s.includes('getFormNames'))
                  .reduce((acc, cur) => ({ [cur]: reduxform('form')[cur]('form'), ...acc }), {})
                results = { getFormNames: reduxform('form').getFormNames(), ...results }
              }),
            ],
          },
          state => state.ui.form,
        )

        // mount basic form
        const Component = makeComponent(store, { field1: 'value1', field2: 'value2' })
        mount(<Component />)

        // dispatch event
        store.dispatch({ type: 'DISPATCHED' })

        // assert
        expect({
          results,
        }).toMatchSnapshot()
      })
    })
  })
}
