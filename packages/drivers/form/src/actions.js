export default state => (form) => {
  const set = type => (values = {}) => state[type].addOrUpdate({ name: form, ...values })

  return ({
    init: set('values'),
    set: set('values'),
    setErrors: set('errors'),
    clearErrors: () => state.errors.reset(form),
    onChange: field => value => state.values.addOrUpdate({ name: form, [field]: value }),
    destroy: () => {
      state.values.remove(form)
      state.errors.remove(form)
    },
  })
}
