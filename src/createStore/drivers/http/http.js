const dispatchFactory = store => name => method =>
  (event, payload, status) => store.dispatch({ type: `@@http/${name}>${method}>${event}`, payload, status })

export default store => name => async (url, options = {}, ...args) => {
  // options
  const { method = 'GET', headers = {} } = options
  const type = headers['Content-Type'] || ''

  // dispatcher
  const dispatch = dispatchFactory(store)(name)(method)

  // request
  let data
  let raw
  dispatch('STARTED')
  try {
    raw = await (global || window).fetch(url, options, ...args)
    data = raw

    if (type.includes('json')) {
      data = await raw.json()
    }
  } catch (ex) {
    dispatch('FAILED', ex, (raw || {}).status)
    return ex
  }

  const { status } = raw
  if (status >= 400 || status < 200) {
    dispatch('FAILED', data, status)
  } else {
    dispatch('ENDED', data, status)
  }

  return data
}
