// TODO: documentation
export const types = {
  array: params => ({ ...params, type: 'simple.array' }),
  bool: params => ({ ...params, type: 'simple.bool' }),
  string: params => ({ ...params, type: 'simple.string' }),
  object: params => ({ ...params, type: 'simple.object' }),
  keyValue: params => ({ ...params, type: 'keyValue' }),
}

export const keyValue = (params) => {
  console.warn('/k-ramel/ You are using a deprecated "keyValue" import. We recommend using `types` : types.object, types.array, types.bool, types.string or types.keyValue')
  return { ...params, type: 'keyValue' }
}

export const simpleObject = (params) => {
  console.warn('/k-ramel/ You are using a deprecated "simpleObject" import. We recommend using `types` : types.object, types.array, types.bool, types.string or types.keyValue')

  return { ...params, type: 'simple.object' }
}
