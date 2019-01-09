# @k-ramel/driver-http
> HTTP driver for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

# Installation
This driver is added by default to k-ramel stores.

# How to use it
In a reaction (See main documentation about listeners/reactions)

```js
export const login = (store, action, drivers) => {
  const { http } = drivers
  const todo = store.data.todos.get(action.payload)

  // TODOS is the context for this request
  // You can then catch events like `/@@http\/TODOS>.*/
  // You have the possibility to add more context with an object on second parameters
  http('TODOS', { myContext: 'todo one' })
    // It will
    // 1. trigger an event like `@@http/TODOS>POST>STARTED`
    // 2. serialize your todo
    // 3. add the header Content-Type to application/json
    // 4. use fetch to call your API
    // 5. trigger event like `@@http/TODOS>POST>FAILED` or `@@http/TODOS>POST>ENDED`
    // 6. if you have added a `context`, it is return on event ;)
    .post('/api/todos', todo)
}
```

# Emitted events
| event type | when |
|---|---|
|`@@http/MY_CONTEXT>POST>STARTED`| when your fetch is started |
|`@@http/MY_CONTEXT>POST>ENDED`| when your fetch is finished with status "OK" and without exception |
|`@@http/MY_CONTEXT>POST>FAILED`| when your fetch respond with errors |

# Event data
All emitted events have some data
| data | description | type |
|---|---|---|
| `type` | event type | `string` | 
| `fetch` | url and fetch options | `array` (`[url, options]`) |
| `status` | status of respond | `number` |
| `payload` | result data of respond | `any` |
| `context` | your optional context added when use the driver | `any` |
