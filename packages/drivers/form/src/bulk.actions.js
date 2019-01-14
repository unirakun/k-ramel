export default ({ keyName, keyFields }) => (state) => {
  const set = type => forms => state[type].addOrUpdate(forms.map(({ name, values }) => ({
    ...values,
    [keyName]: name,
    [keyFields]: Object.keys(values),
  })))

  return ({
    set: set('values'),
    setErrors: set('errors'),
    clearErrors: state.errors.remove, // with form names
    remove: (formNames) => {
      state.values.remove(formNames)
      state.errors.remove(formNames)
    },
  })
}
