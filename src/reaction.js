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

export const when = (...matchers) => callback => (action, store) => {
  const match = matchers
    .map(isMatching(action, store))
    .reduce((acc, curr) => acc && curr, true)

  if (match) return callback(action, store)
  return false
}

export const reaction = fn => Object.assign(
  fn,
  { when: (...args) => when(...args)(fn) },
)

export const reactions = fns => Object.keys(fns)
  .reduce((acc, curr) => ({ ...acc, [curr]: reaction(fns[curr]) }), {})
