export default key => state => (name) => {
  const set = type => (values = {}) => state[type].addOrUpdate({ [key]: name, ...values })
  const remove = (k) => {
    state.values.remove(k)
    state.errors.remove(k)
  }

  return ({
    init: set('values'),
    set: set('values'),
    setErrors: set('errors'),
    clearErrors: () => state.errors.reset(name),
    onChange: field => value => state.values.addOrUpdate({ [key]: name, [field]: value }),
    remove: () => {
      if (name instanceof RegExp) state.values.getKeys().filter(k => k.match(name)).forEach(remove)
      else remove(name)
    },
  })
}
