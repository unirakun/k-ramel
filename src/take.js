import { isRegExp, isString, isFunction } from 'lodash'

const isMatching = (action, store) => matcher => ( // test matching
  // to a string
  (
    isString(matcher) &&
    action.type === matcher
  )
  // to a function
  || (
    isFunction(matcher) &&
    matcher(action, store)
  )
  // to a regexp
  || (
    isRegExp(matcher) &&
    action.type.match(matcher)
  )
)

const take = (...matchers) => callback => (action, store) => {
  const match = matchers
    .map(isMatching(action, store))
    .reduce((acc, curr) => acc && curr, true)

  if (match) return callback(action, store)
  return false
}

export default take
