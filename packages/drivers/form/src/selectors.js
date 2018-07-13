export default state => form => ({
  exists: () => !!state.values.get(form),
  get: type => (field) => {
    const values = state[type].get(form)

    if (!field && values) {
      // remove id from the result so as not to pollute
      const { id, ...rest } = values
      return rest
    }

    return (values && values[field]) || ''
  },
})
