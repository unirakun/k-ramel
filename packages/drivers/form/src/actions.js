export default state => form => ({
  set: type => (values = {}) => state[type].addOrUpdate({ id: form, ...values }),
  reset: type => () => state[type].reset(form),
  onChange: field => value => state.values.addOrUpdate({ id: form, [field]: value }),
  destroy: () => {
    state.values.remove(form)
    state.errors.remove(form)
  },
})
