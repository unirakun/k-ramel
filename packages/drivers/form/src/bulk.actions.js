export default key => (state) => {
  const set = type => forms => state[type].addOrUpdate(forms.map(({ name, ...values }) => ({ ...values, [key]: name })))

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
