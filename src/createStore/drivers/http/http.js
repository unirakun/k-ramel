const dispatchFactory = store => name => method =>
  (event, payload, status) => store.dispatch({ type: `@@http/${name}>${method}>${event}`, payload, status })

export default (store) => {
  const innerHeaders = {}

  const driver = name => async (url, options = {}, ...args) => {
    // options
    const { method = 'GET' } = options
    const headers = { ...innerHeaders, ...options.headers }
    const type = headers['Content-Type'] || ''
    const innerOptions = { ...options, headers }

    // dispatcher
    const dispatch = dispatchFactory(store)(name)(method)

    // request
    let data
    let raw
    dispatch('STARTED')
    try {
      raw = await (global || window).fetch(url, innerOptions, ...args)
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

  // custom helpers
  driver.setAuthorization = (authorization) => {
    innerHeaders.Authorization = authorization
  }

  return driver
}
