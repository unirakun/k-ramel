# @k-ramel/react
> React bindings for k-ramel

 - Main repository: [k-ramel](https://github.com/alakarteio/k-ramel)

## Examples
1. Add a store to React context
```jsx
import { provider } from '@k-ramel/react'
import store from './store' // see k-ramel documentation about building your store

const App = () => <div>My application</div>

export default provider(store)(App)
```

2. Inject store datas to your graphical components
```jsx
import { inject } from '@k-ramel/react'

const Component = ({ label }) => <div>{label}</div>

/* in this example we expect that the store is build with:
  createStore({
    data: {
      label: { type: 'simpleObject', defaultData: 'my-label' },
    },
  })
*/
export default inject(store => ({ label: store.data.label.get() }))(Component)
```
