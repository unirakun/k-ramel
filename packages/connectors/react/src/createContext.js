import { createContext } from 'react'

// this is a singleton :(
let context

export default () => {
  if (!context) context = createContext()
  return context
}
