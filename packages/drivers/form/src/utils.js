export default (state) => {
  const find = search => state.values.getKeys().filter(k => k.match(search))
  const remove = (k) => {
    state.values.remove(k)
    state.errors.remove(k)
  }

  return ({
    find,
    removeEach: search => find(search).forEach(remove),
  })
}
