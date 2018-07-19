/* eslint-env jest */
/* eslint-disable react/jsx-filename-extension */
import { createStore as krmlCreateStore, when, types } from 'k-ramel'

const defaultValues = { first: 'value', second: 'otherValue' }

export default (driver) => {
  const createStore = (listeners = []) => params => krmlCreateStore(
    // TODO: krf doesn't make a reducer with a path. Only add on exist reducer.
    { ui: { default: types.bool() } },
    {
      listeners,
      drivers: {
        form: driver(params),
      },
    },
  )

  const makeReaction = params => (reaction) => {
    const store = createStore([
      when('DISPATCHED')(reaction),
    ])(params)

    store.dispatch({ type: 'DISPATCHED' })
    return store
  }

  const tests = (params) => {
    it('should initialize', () => {
      // store
      const store = createStore()(params)
      // assert
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })

    it('should init', () => {
      const store = makeReaction(params)((action, st, { form }) => {
        form('form').init()
      })
      // assert
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })

    it('should set values', () => {
      const store = makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
      })
      // assert
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })

    it('should set errors and clear', () => {
      let errors
      let cleared
      makeReaction(params)((action, st, { form }) => {
        form('form').setErrors(defaultValues)
        errors = st.getState()
        form('form').clearErrors()
        cleared = st.getState()
      })
      // assert
      expect({
        errors,
        cleared,
      }).toMatchSnapshot()
    })

    it('should remove form', () => {
      let formValues
      let removed
      makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
        form('form').setErrors(defaultValues)
        formValues = st.getState()
        form('form').remove()
        removed = st.getState()
      })
      // assert
      expect({
        formValues,
        removed,
      }).toMatchSnapshot()
    })

    it('should change field', () => {
      let formValues
      let changed
      makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
        formValues = st.getState()
        form('form').onChange('second')('NEW_VALUE')
        changed = st.getState()
      })
      // assert
      expect({
        formValues,
        changed,
      }).toMatchSnapshot()
    })

    it('should get all values', () => {
      let values
      makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
        values = form('form').get()
      })
      // assert
      expect({
        values,
      }).toMatchSnapshot()
    })

    it('should get one value', () => {
      let value
      makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
        value = form('form').get('second')
      })
      // assert
      expect({
        value,
      }).toMatchSnapshot()
    })

    it('should get all errors', () => {
      let errors
      makeReaction(params)((action, st, { form }) => {
        form('form').setErrors(defaultValues)
        errors = form('form').getErrors()
      })
      // assert
      expect({
        errors,
      }).toMatchSnapshot()
    })

    it('should get one error', () => {
      let errors
      makeReaction(params)((action, st, { form }) => {
        form('form').setErrors(defaultValues)
        errors = form('form').getErrors('second')
      })
      // assert
      expect({
        errors,
      }).toMatchSnapshot()
    })

    it('should check if form exists', () => {
      let exists
      let notExists
      makeReaction(params)((action, st, { form }) => {
        form('form').set(defaultValues)
        exists = form('form').exists()
        notExists = form('emptyForm').exists()
      })
      // assert
      expect({
        exists,
        notExists,
      }).toMatchSnapshot()
    })
  }

  describe('drivers/form', () => {
    describe('[default path and key]', () => {
      tests()
    })

    describe('[custom path and key]', () => {
      tests({ path: 'ui.form', getState: state => state.ui.form, key: 'customKey' })
    })
  })
}
