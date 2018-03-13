import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { provider } from '@k-ramel/react'

const Component = () => (
  <div>
    <Field name="field1" component="input" type="text" />
    <Field name="field2" component="input" type="text" />
  </div>
)

export default (store, initialValues) => provider(store)(reduxForm({ form: 'form', initialValues })(Component))
