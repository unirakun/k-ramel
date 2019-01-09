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
|`@@http/MY_CONTEXT>POST>STARTED`| dispatched just before the fetch is started |
|`@@http/MY_CONTEXT>POST>ENDED`| dispatched once the request is done without error (based on HTTP status) |
|`@@http/MY_CONTEXT>POST>FAILED`| dispatched once the request is done **with** error (based on HTTP status) | |

# Actions
All emitted events have some data
| field | description | type |
|---|---|---|
| `type` | event type | `string` | 
| `fetch` | url and fetch options, this can be used to retry a request that is on error | `array` (`[url, options]`) |
| `status` | HTTP status of the response | `number` |
| `payload` | data of the response (if the content type is `application/json`, the data is already parsed) | `any` |
| `context` | your optional context added when use the driver | `any` |
