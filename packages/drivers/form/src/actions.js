export default key => state => (name) => {
  const set = type => (values = {}) => state[type].addOrUpdate({ [key]: name, ...values })

  return ({
    set: set('values'),
    setErrors: set('errors'),
    clearErrors: () => state.errors.reset(name),
    onChange: field => value => state.values.update({ [key]: name, [field]: value }),
    remove: () => state.values.remove(name) && state.errors.remove(name),
  })
}
