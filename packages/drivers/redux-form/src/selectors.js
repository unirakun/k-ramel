import * as reduxform from 'redux-form'

// selectors of redux-form
export const selectorNames = [
  'getFormValues',
  'getFormInitialValues',
  'getFormSyncErrors',
  'getFormMeta',
  'getFormAsyncErrors',
  'getFormSyncWarnings',
  'getFormSubmitErrors',
  'getFormError',
  'isDirty',
  'isPristine',
  'isValid',
  'isInvalid',
  'isSubmitting',
  'hasSubmitSucceeded',
  'hasSubmitFailed',
]

// selectors without parameters
export const selectorNamesWithoutParameter = [
  'getFormNames',
]

const wrapSelector = (getState, getFormState, name, selectorName) => (
  () => reduxform[selectorName](name, getFormState)(getState())
)

export default getFormState => ({ getState }) => name => ({
  ...selectorNames
    .reduce(
      (acc, cur) => ({ [cur]: wrapSelector(getState, getFormState, name, cur), ...acc }),
      {},
    ),
  ...selectorNamesWithoutParameter
    .reduce(
      (acc, cur) => ({ [cur]: () => reduxform[cur](getFormState)(getState()), ...acc }),
      {},
    ),
})
