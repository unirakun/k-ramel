import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { compose } from 'recompose'
import { provider } from '@k-ramel/react'
import { Provider } from 'react-redux'

const withReactReduxProvider = store => Component => props => (
  <Provider store={store}>
    <Component {...props} />
  </Provider>
)

const Component = () => (
  <div>
    <Field name="field1" component="input" type="text" />
    <Field name="field2" component="input" type="text" />
  </div>
)

export default (store, initialValues) => compose(
  withReactReduxProvider(store),
  provider(store),
  reduxForm({ form: 'form', initialValues }),
)(Component)
