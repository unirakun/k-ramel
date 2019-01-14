export default ({ keyName, keyFields }) => state => (name) => {
  const set = type => (values = {}) => state[type].addOrUpdate({
    ...values,
    [keyName]: name,
    [keyFields]: Object.keys(values),
  })

  const update = field => value => state.values.update({
    [keyName]: name,
    [keyFields]: [field],
    [field]: value,
  })

  return ({
    set: set('values'),
    setErrors: set('errors'),
    update,
    clearErrors: () => state.errors.reset(name),
    remove: () => {
      state.values.remove(name)
      state.errors.remove(name)
    },
  })
}
