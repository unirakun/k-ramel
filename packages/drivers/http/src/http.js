// TODO: once Object.fromEntries reach the JS Standard, remove this
const fromEntries = iterable => Object.assign({}, ...Array.from(iterable, ([key, val]) => ({ [key]: val })))

const dispatchFactory = store => (name, context) => method => (
  (event, payload, status, headers, fetch) => store.dispatch({
    type: `@@http/${name}>${method}>${event}`,
    payload,
    status,
    headers,
    fetch,
    context,
  })
)

const getDriver = (store) => {
  let innerOptions = {}

  const driver = (name, context) => {
    const ownFetch = async (url, options = {}, ...args) => {
      // options
      const { method = 'GET' } = options
      const appliedHeaders = { ...innerOptions.headers, ...options.headers }
      const appliedOptions = { ...innerOptions, ...options, headers: appliedHeaders }
      // dispatcher
      const dispatch = dispatchFactory(store)(name, context)(method)

      // request
      let data
      let raw
      let headers
      const fetchArgs = [url, appliedOptions, ...args]
      dispatch('STARTED', undefined, undefined, undefined, fetchArgs)
      try {
        raw = await (global || window).fetch(...fetchArgs)
        data = raw

        if (raw.headers && raw.headers.entries) {
          headers = fromEntries(raw.headers.entries())
        }

        if (raw.headers && raw.headers.get('Content-Type') && raw.headers.get('Content-Type').includes('json')) {
          data = await raw.json()
        }
      } catch (ex) {
        dispatch('FAILED', ex, (raw || {}).status, headers, fetchArgs)
        return ex
      }

      const { status } = raw
      if (status >= 400 || status < 200) {
        dispatch('FAILED', data, status, headers)
      } else {
        dispatch('ENDED', data, status, headers)
      }

      return data
    }

    // methods helpers
    ['GET', 'POST', 'HEAD', 'PATCH', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT']
      .forEach((method) => {
        ownFetch[method.toLowerCase()] = (url, data, options = {}) => {
          const headers = { ...options.headers }
          let appliedOptions = options

          if (data && ['object', 'array'].includes(typeof data)) {
            // attach data as JSON object
            let body = data
            if (!(data instanceof FormData)) {
              headers['Content-Type'] = headers['Content-Type'] || 'application/json'
              body = JSON.stringify(data)
            }
            appliedOptions = { ...appliedOptions, body }
          }

          // set fetch arguments
          appliedOptions = { ...appliedOptions, method, headers }

          return ownFetch(url, appliedOptions)
        }
      })

    return ownFetch
  }

  // custom helpers
  driver.setCredentials = (credentials) => { innerOptions = { ...innerOptions, credentials } }
  driver.setOptions = (options) => {
    innerOptions = { ...options, headers: { ...options.headers } }
  }
  driver.setAuthorization = (authorization) => {
    const headers = { ...innerOptions.headers, Authorization: authorization }
    if (!authorization) delete headers.Authorization

    return driver.setOptions({ ...innerOptions, headers })
  }
  driver.clearAuthorization = () => driver.setAuthorization()

  return driver
}

export default () => ({
  getDriver,
})
