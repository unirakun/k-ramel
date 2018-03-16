const dispatchFactory = store => name => method =>
  (event, payload, status, fetch) => store.dispatch({
    type: `@@http/${name}>${method}>${event}`,
    payload,
    status,
    fetch,
  })

const getDriver = (store) => {
  const innerHeaders = {}
  let innerOptions = {}

  const driver = (name) => {
    const ownFetch = async (url, options = {}, ...args) => {
      // options
      const { method = 'GET' } = options
      const appliedHeaders = { ...innerOptions.headers, ...innerHeaders, ...options.headers }
      const appliedOptions = { ...innerOptions, ...options, headers: appliedHeaders }

      // dispatcher
      const dispatch = dispatchFactory(store)(name)(method)

      // request
      let data
      let raw
      const fetchArgs = [url, appliedOptions, ...args]
      dispatch('STARTED', undefined, undefined, fetchArgs)
      try {
        raw = await (global || window).fetch(...fetchArgs)
        data = raw

        if (raw.headers && raw.headers.get('Content-Type') && raw.headers.get('Content-Type').includes('json')) {
          data = await raw.json()
        }
      } catch (ex) {
        dispatch('FAILED', ex, (raw || {}).status, fetchArgs)
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

    // methods helpers
    ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT']
      .forEach((method) => {
        ownFetch[method.toLowerCase()] = (url, data, options = {}) => {
          const { headers = {} } = options
          let appliedOptions = options

          // attach data as JSON object
          if (data && ['object', 'array'].includes(typeof data)) {
            if (!headers['Content-Type']) appliedOptions = { ...appliedOptions, headers: { ...headers, 'Content-Type': 'application/json' } }

            appliedOptions = { ...appliedOptions, body: JSON.stringify(data) }
          }

          // set method
          appliedOptions = { ...appliedOptions, method }

          return ownFetch(url, appliedOptions)
        }
      })

    return ownFetch
  }

  // custom helpers
  driver.setAuthorization = (authorization) => { innerHeaders.Authorization = authorization }
  driver.setOptions = (options) => { innerOptions = options }
  driver.setCredentials = (credentials) => { innerOptions = { ...innerOptions, credentials } }

  return driver
}

export default () => ({
  getDriver,
})
