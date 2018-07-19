/* eslint-env jest */
/* eslint-disable react/jsx-filename-extension */
import { createStore as krmlCreateStore, when, keyValue } from 'k-ramel'

export default (driver) => {
  const createStore = (listeners = []) => params => krmlCreateStore(
    { ui: { default: keyValue() } },
    {
      listeners,
      drivers: {
        form: driver(params),
      },
    },
  )

  describe('drivers/form', () => {
    it('should initialize store with default path', () => {
      // store
      const store = createStore()()

      // assert
      expect({
        store,
      }).toMatchSnapshot()
    })

    it('should initialize store with custom path', () => {
      // store
      const store = createStore()({ path: 'ui.form', getState: state => state.ui.form, key: 'customKey' })

      // assert
      expect({
        store,
      }).toMatchSnapshot()
    })
  })
}
