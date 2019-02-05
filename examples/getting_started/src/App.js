/* eslint-disable */
import React from 'react'
import { createStore, types, when } from 'k-ramel'
import { provider, inject, listen } from '@k-ramel/react'
import createHttpDriver from '@k-ramel/driver-http'

const store = createStore(
  {
    todos: types.keyValue(),
  },
  {
    drivers: {
      http: createHttpDriver(),
    },
  },
)

store.todos.add({ id: 2, title: 'finish the documentation' })
store.todos.add({ id: 32, title: 'an other' })

console.log(store.todos.get(2))

const Todos = ({ todos, onClick }) => (
  <div>
    <button onClick={onClick}>Add a todo!</button> {/* c. */}
    <ul>
      {todos.map(({ id, title }) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
  </div>
)

const TodosContainer = inject((store) => {
  return {
    todos: store.todos.getAsArray(),
    onClick: () => store.dispatch('@@ui/ADD_TODO>CLICKED')
  }
})(Todos)

const App = () => (
  <TodosContainer />
)

const listeners = [
  when('@@krf/ADD>TODOS')(() => {
    console.log('A todo is added!')
  }),
   when('@@ui/ADD_TODO>CLICKED')((action, store, drivers) => {
     drivers.http('TODO').post(
      'https://todo-backend-modern-js.herokuapp.com/todos',
      {
        title: 'Yo! I am a new todo!',
      },
    )
  }),
   when('@@http/TODO>POST>ENDED')((action, store) => {
     store.todos.add(action.payload)
   }),
]

const AppContainer = listen(listeners)(App)

export default provider(store)(AppContainer)
