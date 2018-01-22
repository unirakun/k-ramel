import { isRegExp, isString, isFunction } from 'lodash'

const take = (match, callback) => (action, store) => {
  const isMatching = ( // test matching
    // to a string
    (
      isString(match) &&
      action.type === match
    )
    // to a function
    || (
      isFunction(match) &&
      match(action, store)
    )
    // to a regexp
    || (
      isRegExp(match) &&
      action.type.match(match)
    )
  )

  if (isMatching) return callback(action, store)
  return false
}

export default take
