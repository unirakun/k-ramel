export default (state) => {
  const find = search => state.values.getKeys().filter(k => k.match(search))

  return ({
    find,
    remove: formNames => state.values.remove(formNames) && state.errors.remove(formNames),
  })
}
