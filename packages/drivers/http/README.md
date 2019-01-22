# @k-ramel/driver-http
> HTTP driver for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Install it
`yarn add @k-ramel/driver-http regeneratorRuntime`

## How to use it
In a reaction (See main documentation about listeners/reactions)

First you have to add it to define it to the store.
```js
import { createStore, types } from 'k-ramel'
import http from '@k-ramel/driver-http'

const store = createStore(
  {
    data: {
      users: types.keyValue(),
    },
  },
  {
    drivers: {
      http,
    },
  },
)
```

Then you can use it in reactions and listeners
```js
export const save = (action, store, drivers) => {
  const { http } = drivers
  const todo = store.data.todos.get(action.payload)

  // TODOS is the context for this request
  // You can then catch events like `/@@http\/TODOS>.*/
  http('TODOS')
    // It will
    // 1. trigger an event like `@@http/TODOS>POST>STARTED`
    // 2. serialize your todo
    // 3. add the header Content-Type to application/json
    // 4. use fetch to call your API
    // 5. trigger event like `@@http/TODOS>POST>FAILED` or `@@http/TODOS>POST>ENDED`
    .post('/api/todos', todo)
}
```

## Context
Sometimes you need to remember why you did a request when you receive a terminal event (`FAILED` or `ENDED`):

In the previous example, if your API just returns `200` in case of success without any payload and you still want to let your user knows that the todo is actually saved (green border), then you don't know which todo to update!

In this cases you can use the context object:
```js
export const save = (action, store, drivers) => {
  const { http } = drivers
  const todo = store.data.todos.get(action.payload)

  http('TODOS', { id: todo.id })
    .post('/api/todos', todo)
}
```

Then the `FAILED` or `ENDED` event will have a `context` field with the related todo id in it!
You can use it to update your ui and give your user feedback!
```js
// listeners.js
// ...
when('@@http/TODOS>POST>ENDED')(updateAfterSave),

// reactions.js
// ...
export const updateAfterSave = (action, store) => {
  const { context } = action
  store.data.todos.update({ id: context.id, saved: true, error: false })
}
```

## Emitted events
| event type | when |
|---|---|
|`@@http/MY_CONTEXT>POST>STARTED`| dispatched just before the fetch is started |
|`@@http/MY_CONTEXT>POST>ENDED`| dispatched once the request is done without error (based on HTTP status) |
|`@@http/MY_CONTEXT>POST>FAILED`| dispatched once the request is done **with** error (based on HTTP status) | |

## Actions
All emitted events have some data
| field | description | type |
|---|---|---|
| `type` | event type | `string` |
| `fetch` | url and fetch options, this can be used to retry a request that is on error | `array` (`[url, options]`) |
| `status` | HTTP status of the response | `number` |
| `headers` | HTTP response headers | `object` (`header name` -> `header value`) |
| `payload` | data of the response (if the content type is `application/json`, the data is already parsed) | `any` |
| `context` | your optional context added when use the driver. The context help you to recognize the `FAILED` or `ENDED` event and react with the right reaction. | `any` |
