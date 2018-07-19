export default state => (form) => {
  const get = type => (field) => {
    const values = state[type].get(form)

    if (!field && values) {
      // remove name from the result so as not to pollute
      const { name, ...rest } = values
      return rest
    }

    return (values && values[field]) || ''
  }

  return {
    exists: () => !!state.values.get(form),
    get: get('values'),
    getErrors: get('errors'),
  }
}
