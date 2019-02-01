# Getting started
This getting started shows you how to use k-ramel with React, but you can use k-ramel with something else (or as a standalone).

But first of all, you have to install dependencies: `yarn add k-ramel @k-ramel/driver-http @k-ramel/react`
 - **k-ramel** is the base package
 - **@k-ramel/driver-http** will be used to request some API
 - **@k-ramel/react** will be used to connect k-ramel with ReactJS

## 1. Create the store
```diff
+import { createStore, types } from 'k-ramel'
+
+const store = createStore(
+  {
+    todos: types.keyValue(),
+  },
+)
```

Here we created a store with `todos` that is a keyValue types.

## 2. Use the store
```diff
import { createStore, types } from 'k-ramel'

const store = createStore({
  todos: types.keyValue(),
})

+store.todos.add({ id: 2, title: 'finish the documentation' }) // a.
+store.todos.add({ id: 32, title: 'an other' })

+console.log(store.todos.get(2)) // b.
```

Now you can use the store :
  - (a) We added a todo, the id is the default key used by keyValue
  - (b) We retrieve (and log) the todo that has the key equals to `2`

## 3. Provide the store to React (context)
```diff
+import React from 'react'
import { createStore, types } from 'k-ramel'
+import { provider } from '@k-ramel/react'

const store = createStore(
  {
    todos: types.keyValue(),
  },
)

store.todos.add({ id: 2, title: 'finish the documentation' })
store.todos.add({ id: 32, title: 'an other' })

console.log(store.todos.get(2))
+
+const App = () => (
+  <div>Hey!</div>
+)
+
+export default provider(store)(App)
```

Now the store is provided in React context, we can use it and bind our a component to it!

## 4. Bind a React component
```diff
import React from 'react'
import { createStore, types } from 'k-ramel'
-import { provider } from '@k-ramel/react'
+import { provider, inject } from '@k-ramel/react'

const store = createStore(
  {
    todos: types.keyValue(),
  },
)

store.todos.add({ id: 2, title: 'finish the documentation' })
store.todos.add({ id: 32, title: 'an other' })

console.log(store.todos.get(2))
+
+ // a.
+const Todos = ({ todos }) => (
+  <ul>
+    {todos.map(({ id, title }) => (
+      <li key={id}>{title}</li>
+    ))}
+  </ul>
+)
+
+ // b.
+const TodosContainer = inject((store) => {
+  return {
+    todos: store.todos.getAsArray(),
+  }
+})(Todos)

const App = () => (
-  <div>Hey!</div>
+  <TodosContainer /> // c.
)

export default provider(store)(App)
```

We create a classical React Component (a) and inject todos (as array) in its props (b), and finally we use this new component in our App (c)

## 5. Add a new todos (store mutation)
```diff
import React from 'react'
import { createStore, types } from 'k-ramel'
import { provider, inject } from '@k-ramel/react'

const store = createStore(
  {
    todos: types.keyValue(),
  },
)

store.todos.add({ id: 2, title: 'finish the documentation' })
store.todos.add({ id: 32, title: 'an other' })

console.log(store.todos.get(2))

-const Todos = ({ todos }) => (
+const Todos = ({ todos, onClick }) => (
+  <div>
+    <button onClick={onClick}>Add a todo!</button> {/* c. */}
    <ul>
      {todos.map(({ id, title }) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
+  </div>
)

const TodosContainer = inject((store) => {
  return {
    todos: store.todos.getAsArray(),
+    // a.
+    onClick: () => {
+      // b.
+      store.todos.add({ id: Math.random(), title: 'Yo! I am a new todo!' })
+    }
  }
})(Todos)

const App = () => (
  <TodosContainer />
)

export default provider(store)(App)
```

When we click on the new button (c), the function injected (a) is triggered. This function ask for a mutation (b), which add a new todo (the title is hardcoded here)

## 6. Listen to the todo addition
```diff
import React from 'react'
-import { createStore, types } from 'k-ramel'
+import { createStore, types, when } from 'k-ramel'
-import { provider, inject } from '@k-ramel/react'
+import { provider, inject, listen } from '@k-ramel/react'

const store = createStore(
  {
    todos: types.keyValue(),
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
    onClick: () => {
      store.todos.add({ id: Math.random(), title: 'Yo! I am a new todo!' })
    }
  }
})(Todos)

const App = ({ onClick }) => (
  <TodosContainer />
)
+
+const listeners = [
+  when('@@krf/ADD>TODOS')(() => {
+    console.log('A todo is added!')
+  })
+]
+
+const AppContainer = listen(listeners)(App)

-export default provider(store)(App)
+export default provider(store)(AppContainer)
```

Here we opened redux-devtools, click on the button, and look at actions that are logged into redux-devtools :).\
We see that the action `@@krf>ADD>TODOS` is the one triggered when a new todo is added.\
We then **listen** to this specific action, and **react** to it, here we print a message to the console.

Note that you can bind listeners everywhere you want, this is convenient to add listeners to a screen, so your code logic is near the related screen!

## 7. Connect our app to a HTTP API
```diff
import React from 'react'
import { createStore, types, when } from 'k-ramel'
import { provider, inject, listen } from '@k-ramel/react'
+import createHttpDriver from '@k-ramel/driver-http'

const store = createStore(
  {
    todos: types.keyValue(),
  },
+  { // a.
+    drivers: {
+      http: createHttpDriver(),
+    },
+  },
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
-    onClick: () => {
-      store.todos.add({ id: Math.random(), title: 'Yo! I am a new todo!' })
-    }
+    // b.
+    onClick: () => store.dispatch('@@ui/ADD_TODO>CLICKED')
  }
})(Todos)

const App = () => (
  <TodosContainer />
)

const listeners = [
  when('@@krf/ADD>TODOS')(() => {
    console.log('A todo is added!')
  }),
+  // c.
+  when('@@ui/ADD_TODO>CLICKED')(async (action, store, drivers) => {
+    const todo = await drivers.http('TODO').post(
+      'https://todo-backend-modern-js.herokuapp.com/todos',
+      {
+        title: 'Yo! I am a new todo!',
+      },
+    )
+
+    store.todos.add(todo)
+  })
]

const AppContainer = listen(listeners)(App)

export default provider(store)(AppContainer)
```

First we add a new driver to **k-ramel**, the http driver. (a.) \
Then we changed the `onClick` callback so it dispatch an empty action whose type is `@@ui/ADD_TODO>CLICKED` (b.), this action is catched into our **listeners**, and we react to it by calling an API (c.).\
The TODO title is hardcoded, you can see we `await` the API response, and add the todo to the store after the API responds.

If you open your redux-devtools you will see that the HTTP driver trigger 2 actions (2 events) :
 - One at start
 - One at end

We'll use this last event to trigger the addition to the store instead of awaiting the driver.

## 8. Use the HTTP driver ENDED action
```diff
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
-  when('@@ui/ADD_TODO>CLICKED')(async (action, store, drivers) => {
-    const todo = await drivers.http('TODO').post(
+  when('@@ui/ADD_TODO>CLICKED')((action, store, drivers) => {
+    drivers.http('TODO').post(
      'https://todo-backend-modern-js.herokuapp.com/todos',
      {
        title: 'Yo! I am a new todo!',
      },
    )
-
-    store.todos.add(todo)
  }),
+  when('@@http/TODO>POST>ENDED')((action, store) => {
+    store.todos.add(action.payload)
+  }),
]

const AppContainer = listen(listeners)(App)

export default provider(store)(AppContainer)
```

We don't use **async/await** anymore but you Redux as an eventbus and react to the **ENDED** event triggered by the HTTP driver to, at the end, add the todo into the store.

You can find the last version here in [examples/getting_started](https://github.com/alakarteio/k-ramel/tree/master/examples/getting_started).
