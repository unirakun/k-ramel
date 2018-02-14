import { combineReducers } from 'redux'

export default (root) => {
  const subcombine = (current) => {
    const reducers = Object
      .keys(current)
      .map((key) => {
        const cur = current[key]
        if (typeof cur === 'function') return ({ [key]: cur })
        return ({ [key]: subcombine(cur) })
      })
      .reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      )

    return combineReducers(reducers)
  }

  return subcombine(root)
}
