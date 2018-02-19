import {
  // actions
  initialize,
  setSubmitSucceeded,
  setSubmitFailed,
  startSubmit,
  stopSubmit,
  change,
  // selectors
  getFormValues,
  getFormInitialValues,
  isSubmitting,
} from 'redux-form'

const asyncSubmit = (name, { dispatch, getState }) => async (callback, ...options) => {
  dispatch(startSubmit(name))
  const res = await callback(...options)
  if (isSubmitting(name)(getState())) dispatch(stopSubmit(name))
  return res
}

export default getFormState => store => (name) => {
  const { dispatch, getState } = store
  return {
    // actions
    initialize: (...args) => dispatch(initialize(name, ...args)),
    setSubmitFailed: (...args) => dispatch(setSubmitFailed(name, ...args)),
    setSubmitSucceeded: () => dispatch(setSubmitSucceeded(name)),
    startSubmit: () => dispatch(startSubmit(name)),
    stopSubmit: errors => dispatch(stopSubmit(name, errors)),
    asyncSubmit: (callback, ...options) => asyncSubmit(name, store)(callback, ...options),
    change: (...args) => dispatch(change(name, ...args)),
    // selectors
    getFormValues: () => getFormValues(name, getFormState)(getState()),
    getFormInitialValues: () => getFormInitialValues(name, getFormState)(getState()),
    isSubmitting: () => isSubmitting(name, getFormState)(getState()),
  }
}
