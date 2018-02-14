/* eslint-env jest */
import getWrappedDisplayName from './getWrappedDisplayName'

describe('react/getWrappedDisplayName', () => {
  it('should print a displayName', () => {
    expect({
      'Component.displayName': getWrappedDisplayName({ displayName: 'Component.displayName' }),
      'Component.name': getWrappedDisplayName({ name: 'Component.name' }),
      'Component.constructor.name': getWrappedDisplayName({ constructor: { name: 'Component.constructor.name' } }),
      Unknown: getWrappedDisplayName({ constructor: {} }),
    }).toMatchSnapshot()
  })
})
