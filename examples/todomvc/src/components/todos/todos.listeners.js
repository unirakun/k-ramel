import { when } from 'k-ramel'

export default [
  when(/.*ADDED/)(() => { console.log('reaction - added') }),
]
