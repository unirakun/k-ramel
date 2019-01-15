export default keys => state => (name) => {
  const get = type => (field) => {
    const values = state[type].get(name)
    if (!values) {
      if (field) return ''
      return {}
    }

    if (!field && values) {
      // remove `key` from the returned values
      const rest = { ...values }
      Object.values(keys).forEach((key) => { delete rest[key] })

      return rest
    }

    const value = values[field]
    if (value === undefined || value === null) return ''

    return value
  }

  return {
    exists: () => !!state.values.get(name),
    get: get('values'),
    getErrors: get('errors'),
  }
}
