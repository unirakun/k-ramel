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
        form('form-name').set()
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
        form('form-name').resetErrors()
        cleared = st.getState()
      })
      // assert
      expect({
        errors,
        cleared,
      }).toMatchSnapshot()
    })

    it('should reset form', () => {
      let formValues
      let removed
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        form('form-name').setErrors(defaultValues)
        formValues = st.getState()
        form('form-name').reset()
        removed = st.getState()
      })
      // assert
      expect({
        formValues,
        removed,
      }).toMatchSnapshot()
    })

    it('should reset form with an array of formName', () => {
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
        form.reset(['form1', 'form2'])
        removed = st.getState()
      })
      // assert
      expect({
        formValues,
        removed,
      }).toMatchSnapshot()
    })

    it('should update existing field', () => {
      let formValues
      let updated
      runReaction(params)((action, st, { form }) => {
        form('form-name').set(defaultValues)
        formValues = st.getState()
        form('form-name').update('second')('NEW_VALUE')
        updated = st.getState()
      })
      // assert
      expect({
        formValues,
        updated,
      }).toMatchSnapshot()
    })

    it('should update when form is gone', () => {
      let formValues
      let updated
      runReaction(params)((action, st, { form }) => {
        formValues = st.getState()
        form('form-name').update('second')('NEW_VALUE')
        updated = st.getState()
      })
      // assert
      expect({
        formValues,
        updated,
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

    it('should check if forms exists', () => {
      let formNames
      runReaction(params)((action, st, { form }) => {
        form('form-1').set(defaultValues)
        form('form-2').set(defaultValues)
        form('other-form').set(defaultValues)
        form('form-12').set(defaultValues)
        formNames = form.find(/form-.*/)
      })
      // assert
      expect({
        formNames,
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

    describe('bulk mode', () => {
      it('should set values', () => {
        // run implementation
        let state
        runReaction()((action, store, { form }) => {
          form.set([
            { name: 'form-1', values: { firstname: 'guillaume', lastname: 'crespel' } },
            { name: 'form-2', values: { firstname: 'fabien', lastname: 'juif' } },
          ])

          state = {
            values: store.form.values.get(),
            errors: store.form.errors.get(),
          }
        })

        // assert
        expect({
          state,
        }).toMatchSnapshot()
      })

      it('should set values with custom key', () => {
        // run implementation
        let state
        runReaction({ key: 'my-key' })((action, store, { form }) => {
          form.set([
            { name: 'form-1', values: { firstname: 'guillaume', lastname: 'crespel' } },
            { name: 'form-2', values: { firstname: 'fabien', lastname: 'juif' } },
          ])

          state = {
            values: store.form.values.get(),
            errors: store.form.errors.get(),
          }
        })

        // assert
        expect({
          state,
        }).toMatchSnapshot()
      })

      it('should set errors', () => {
        // run implementation
        let state
        runReaction()((action, store, { form }) => {
          form.setErrors([
            { name: 'form-1', values: { firstname: 'required' } },
            { name: 'form-2', values: { lastname: 'required' } },
          ])

          state = {
            values: store.form.values.get(),
            errors: store.form.errors.get(),
          }
        })

        // assert
        expect({
          state,
        }).toMatchSnapshot()
      })

      it('should resetErrors errors', () => {
        // run implementation
        let state
        runReaction()((action, store, { form }) => {
          // set values and errors
          form.set([
            { name: 'form-1', values: { lastname: 'crespel' } },
            { name: 'form-2', values: { firstname: 'fabien' } },
          ])
          form.setErrors([
            { name: 'form-1', values: { firstname: 'required' } },
            { name: 'form-2', values: { lastname: 'required' } },
          ])

          // remove errors
          form.resetErrors(['form-1', 'form-2'])

          state = {
            values: store.form.values.get(),
            errors: store.form.errors.get(),
          }
        })

        // assert
        expect({
          state,
        }).toMatchSnapshot()
      })

      it('should reset forms', () => {
        // run implementation
        let state
        runReaction()((action, store, { form }) => {
          // set values and errors
          form.set([
            { name: 'form-1', values: { lastname: 'crespel' } },
            { name: 'form-2', values: { firstname: 'fabien' } },
            { name: 'form-3', values: { firstname: 'delphine' } },
          ])

          form.setErrors([
            { name: 'form-1', values: { firstname: 'required' } },
            { name: 'form-2', values: { lastname: 'required' } },
            { name: 'form-3', values: { lastname: 'required' } },
          ])

          // remove forms
          form.reset(['form-1', 'form-2'])

          state = {
            values: store.form.values.get(),
            errors: store.form.errors.get(),
          }
        })

        // assert
        expect({
          state,
        }).toMatchSnapshot()
      })

      it('should returns updated field names', () => {
        // run implementation
        let fieldNames
        runReaction()((action, store, { form }) => {
          fieldNames = form.getUpdatedFieldNames({
            payload: {
              '@@form-name': 'myForm',
              '@@form-fields': ['first', 'second'],
              first: true,
              second: 'ok',
            },
          })
        })

        // assert
        expect({
          fieldNames,
        }).toMatchSnapshot()
      })

      it('should returns updated field names and values', () => {
        // run implementation
        let fieldValues
        runReaction()((action, store, { form }) => {
          fieldValues = form.getUpdatedValues({
            payload: {
              '@@form-name': 'myForm',
              '@@form-fields': ['first', 'second'],
              first: true,
              second: 'ok',
            },
          })
        })

        // assert
        expect({
          fieldValues,
        }).toMatchSnapshot()
      })

      it('should returns updated field entries', () => {
        // run implementation
        let entries
        runReaction()((action, store, { form }) => {
          entries = form.getUpdatedEntries({
            payload: {
              '@@form-name': 'myForm',
              '@@form-fields': ['first', 'second'],
              first: true,
              second: 'ok',
            },
          })
        })

        // assert
        expect({
          entries,
        }).toMatchSnapshot()
      })
    })
  })
}
