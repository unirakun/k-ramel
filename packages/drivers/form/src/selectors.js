export default key => state => (name) => {
  const get = type => (field) => {
    const values = state[type].get(name)

    if (!field && values) {
      // remove `key` from the result so as not to pollute
      const rest = { ...values }
      delete rest[key]
      return rest
    }

    return (values && values[field]) || undefined
  }

  return {
    exists: () => !!state.values.get(name),
    get: get('values'),
    getErrors: get('errors'),
  }
}
