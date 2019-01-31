export default ({ keyName, keyFields }) => (state) => {
  const set = type => forms => state[type].add(forms.map(({ name, values }) => ({
    ...values,
    [keyName]: name,
    [keyFields]: Object.keys(values),
  })))

  const addOrUpdate = type => forms => state[type].addOrUpdate(forms.map(({ name, values }) => ({
    ...values,
    [keyName]: name,
    [keyFields]: Object.keys(values),
  })))

  return ({
    // values
    set: set('values'),
    addOrUpdate: addOrUpdate('values'),
    // errors
    setErrors: set('errors'),
    addOrUpdateErrors: addOrUpdate('errors'),
    resetErrors: state.errors.remove, // with form names
    // both values and errors
    reset: (formNames) => {
      state.values.remove(formNames)
      state.errors.remove(formNames)
    },
  })
}
