export default ({ keyName, keyFields }) => state => (name) => {
  const set = type => (values = {}) => state[type].add({
    ...values,
    [keyName]: name,
    [keyFields]: Object.keys(values),
  })

  const addOrUpdate = type => (values = {}) => state[type].addOrUpdate({
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
    // values
    update,
    set: set('values'),
    addOrUpdate: addOrUpdate('values'),
    // errors
    setErrors: set('errors'),
    addOrUpdateErrors: addOrUpdate('errors'),
    resetErrors: () => state.errors.remove(name),
    // both values and errors
    reset: () => {
      state.values.remove(name)
      state.errors.remove(name)
    },
  })
}
