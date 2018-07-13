export default state => form => ({
  exists: () => !!state.values.get(form),
  get: type => (field) => {
    const values = state[type].get(form)

    if (!field && values) {
      delete values.form
      return values
    }

    if (!values) return ''
    return values[field] || ''
  },
})
