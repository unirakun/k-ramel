import { combineReducers } from 'redux'
import reseter from './reseter'

export default (root) => {
  const subcombine = (current, currentPath) => {
    const reducers = Object
      .keys(current)
      .map((key) => {
        const cur = current[key]
        const path = `${currentPath ? `${currentPath}.` : ''}${key}`
        if (typeof cur === 'function') return ({ [key]: reseter(cur, path) })
        return ({ [key]: subcombine(cur, path) })
      })
      .reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      )

    return combineReducers(reducers)
  }

  return subcombine(root, '')
}
