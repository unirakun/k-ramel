export const array = params => ({ ...params, type: 'simple.array' })

export const bool = params => ({ ...params, type: 'simple.bool' })

export const string = params => ({ ...params, type: 'simple.string' })

export const object = params => ({ ...params, type: 'simple.object' })

export const number = params => ({ ...params, type: 'simple.number' })

export const keyValue = params => ({ ...params, type: 'keyValue' })
