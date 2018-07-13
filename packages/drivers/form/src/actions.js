export default state => form => ({
  set: type => (values = {}) => state[type].addOrUpdate({ form, ...values }),
  reset: type => () => state[type].reset(form),
  onChange: field => value =>  state.values.addOrUpdate({ form, [field]: value }),
  destroy: () => {
    state.values.remove(form)
    state.errors.remove(form)
  }
})
