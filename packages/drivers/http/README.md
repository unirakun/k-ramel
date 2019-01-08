# @k-ramel/driver-http
> HTTP driver for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

This driver is added by default to k-ramel stores.

## Examples
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
