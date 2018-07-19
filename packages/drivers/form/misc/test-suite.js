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

  const runReaction = params => (reaction) => {
    const store = createStore([
      when('DISPATCHED')(reaction),
    ])(params)

    store.dispatch({ type: 'DISPATCHED' })
  }

  const tests = (params) => {
    it('should initialize the driver', () => {
      // store
      const store = createStore()(params)
      // assert
      expect({
        state: store.getState(),
      }).toMatchSnapshot()
    })

    it('should initialize a form', () => {
      let formState
      runReaction(params)((action, st, { form }) => {
        form('form-name').init()
        formState = st.getState()
      })
      // assert
      expect({
        formState,
      }).toMatchSnapshot()
    })

    it('should set values', () => {
      let formState
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        formState = st.getState()
      })
      // assert
      expect({
        formState,
      }).toMatchSnapshot()
    })

    it('should set errors and clear', () => {
      let errors
      let cleared
      runReaction(params)((action, st, { form }) => {
        form('form-name').setErrors(defaultValues)
        errors = st.getState()
        form('form-name').clearErrors()
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
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        form('form-name').setErrors(defaultValues)
        formValues = st.getState()
        form('form-name').remove()
        removed = st.getState()
      })
      // assert
      expect({
        formValues,
        removed,
      }).toMatchSnapshot()
    })

    it('should remove form with regexp', () => {
      let formValues
      let removed
      runReaction(params)((action, st, { form }) => {
        form('form1').set(defaultValues)
        form('form1').setErrors(defaultValues)
        form('form2').set(defaultValues)
        form('form2').setErrors(defaultValues)
        form('notRemove').set(defaultValues)
        form('notRemove').setErrors(defaultValues)
        formValues = st.getState()
        form(/form.*/).remove()
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
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        formValues = st.getState()
        form('form-name').onChange('second')('NEW_VALUE')
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
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        values = form('form-name').get()
      })
      // assert
      expect({
        values,
      }).toMatchSnapshot()
    })

    it('should get one value', () => {
      let value
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        value = form('form-name').get('second')
      })
      // assert
      expect({
        value,
      }).toMatchSnapshot()
    })

    it('should get all errors', () => {
      let errors
      runReaction(params)((action, st, { form }) => {
        form('form-name').setErrors(defaultValues)
        errors = form('form-name').getErrors()
      })
      // assert
      expect({
        errors,
      }).toMatchSnapshot()
    })

    it('should get one error', () => {
      let errors
      runReaction(params)((action, st, { form }) => {
        form('form-name').setErrors(defaultValues)
        errors = form('form-name').getErrors('second')
      })
      // assert
      expect({
        errors,
      }).toMatchSnapshot()
    })

    it('should check if form exists', () => {
      let exists
      let notExists
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        exists = form('form-name').exists()
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
