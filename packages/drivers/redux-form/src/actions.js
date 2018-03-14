import * as reduxform from 'redux-form'

// actions of redux-form
export const actionNames = [
  'arrayInsert',
  'arrayMove',
  'arrayPop',
  'arrayPush',
  'arrayRemove',
  'arrayRemoveAll',
  'arrayShift',
  'arraySplice',
  'arraySwap',
  'arrayUnshift',
  'autofill',
  'blur',
  'change',
  'clearAsyncError',
  'clearSubmitErrors',
  'clearFields',
  'destroy',
  'focus',
  'initialize',
  'registerField',
  'reset',
  'resetSection',
  'setSubmitFailed',
  'setSubmitSucceeded',
  'startAsyncValidation',
  'startSubmit',
  'stopSubmit',
  'stopAsyncValidation',
  'submit',
  'touch',
  'unregisterField',
  'untouch',
]

const wrapAction = (dispatch, name, actionName) =>
  (...args) => dispatch(reduxform[actionName](name, ...args))

export default ({ dispatch }) => name =>
  actionNames
    .reduce(
      (acc, cur) => ({ [cur]: wrapAction(dispatch, name, cur), ...acc }),
      {},
    )
