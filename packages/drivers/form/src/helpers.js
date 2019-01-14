const getUpdatedValues = ({ keyName, keyFields }) => (action) => {
  const values = { ...action.payload }
  delete values[keyName]
  delete values[keyFields]

  return values
}

const getUpdatedFieldNames = ({ keyFields }) => action => (
  action.payload[keyFields]
)

const getUpdatedEntries = keys => action => (
  Object.entries(getUpdatedValues(keys)(action))
)

export default keys => ({
  getUpdatedFieldNames: getUpdatedFieldNames(keys),
  getUpdatedValues: getUpdatedValues(keys),
  getUpdatedEntries: getUpdatedEntries(keys),
})
