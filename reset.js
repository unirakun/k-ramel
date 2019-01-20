const { createStore, types } = require('./packages/k-ramel')

const store = createStore({
  data: {
    nested: {
      input: types.string(),
    },
    shows: types.keyValue(),
  },
  ui: types.bool(),
})

const setData = () => {
  store.data.nested.input.set('example')
  store.data.shows.set([{ id: 1, name: 'Scrubs' }, { id: 2, name: 'HIMYM' }])
  store.ui.set(true)

  console.log('Data\n', store.getState())
}

setData()
console.log(store.ui.reset())
console.log('reset "ui"\n', store.getState())

setData()
console.log(store.reset())
console.log('reset ""\n', store.getState())

setData()
console.log(store.data.nested.reset())
console.log('reset "data.nested"\n', store.getState())
