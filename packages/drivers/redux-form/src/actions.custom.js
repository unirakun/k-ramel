import { startSubmit, isSubmitting, stopSubmit } from 'redux-form'

const asyncSubmit = (name, { dispatch, getState }) => async (callback, ...options) => {
  dispatch(startSubmit(name))
  const res = await callback(...options)
  if (isSubmitting(name)(getState())) dispatch(stopSubmit(name))
  return res
}

// custom actions
export default store => name => ({
  asyncSubmit: (callback, ...options) => asyncSubmit(name, store)(callback, ...options),
})
